import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import {
  habits,
  habitLogs,
  streaks,
  goals,
  weeklyReports,
} from "@/drizzle/schema";
import {
  generateWeeklyReport as generateAIWeeklyReport,
  WeeklyReport,
} from "@/lib/gemini";
import { buildWeeklyReportPrompt } from "@/lib/promptBuilder";

const CACHE_TTL = 60 * 60 * 24 * 7;

export interface GenerateWeeklyReportResult {
  success: boolean;
  report: WeeklyReport;
}

export async function generateWeeklyReportForUser(
  userId: string,
): Promise<GenerateWeeklyReportResult> {
  const cacheKey = `weekly-report:${userId}`;

  // -----------------------
  // Cache
  // -----------------------

  try {
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error("Weekly report cache read failed:", error);
  }

  // Week Range

  const weekEnd = new Date();

  const weekStart = new Date();

  weekStart.setDate(weekEnd.getDate() - 6);

  weekStart.setHours(0, 0, 0, 0);

  weekEnd.setHours(23, 59, 59, 999);

  // Load Data

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const logs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.userId, userId),
      gte(habitLogs.completedAt, weekStart),
      lte(habitLogs.completedAt, weekEnd),
    ),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const userGoals = await db.query.goals.findMany({
    where: eq(goals.userId, userId),
  });

  // Completion %

  const completionRate =
    userHabits.length === 0
      ? 0
      : Math.round((logs.length / (userHabits.length * 7)) * 100);

  // Build Prompt

  const prompt = buildWeeklyReportPrompt({
    habits: userHabits,
    logs,
    streaks: userStreaks,
    goals: userGoals,
  });

  // Gemini

  const aiReport = await generateAIWeeklyReport(prompt);

  const report: WeeklyReport = {
    title: aiReport.title || "Weekly Habit Report",

    summary: aiReport.summary || "Your weekly progress summary.",

    strengths: aiReport.strengths || [],

    improvements: aiReport.improvements || [],

    recommendations: aiReport.recommendations || [],
  };

  // Save

  await db.insert(weeklyReports).values({
    id: crypto.randomUUID(),
    userId,
    weekStart,
    weekEnd,
    completionRate,
    totalHabits: userHabits.length,
    completedHabits: logs.length,
    title: report.title,
    summary: report.summary,
    strengths: report.strengths,
    improvements: report.improvements,
    recommendations: report.recommendations,
    generatedAt: new Date(),
  });

  const result: GenerateWeeklyReportResult = {
    success: true,
    report,
  };

  // Cache

  try {
    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);
  } catch (error) {
    console.error("Weekly report cache write failed:", error);
  }

  return result;
}
