"use server";

import { and, eq, gte, lte } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { generateWeeklyReport as generateAIWeeklyReport } from "@/lib/gemini";
import { buildWeeklyReportPrompt } from "@/lib/promptBuilder";

import {
  habits,
  habitLogs,
  streaks,
  goals,
  weeklyReports,
} from "@/drizzle/schema";

interface WeeklyReport {
  title: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

interface GenerateWeeklyReportResult {
  success: boolean;
  report: WeeklyReport;
}

const CACHE_TTL = 60 * 60 * 24 * 7;

export async function generateWeeklyReport(): Promise<GenerateWeeklyReportResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const cacheKey = `weekly-report:${userId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const weekEnd = new Date();

  const weekStart = new Date();

  weekStart.setDate(weekEnd.getDate() - 6);

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

  const completionRate =
    userHabits.length === 0
      ? 0
      : Math.round((logs.length / (userHabits.length * 7)) * 100);

  const prompt = buildWeeklyReportPrompt({
    habits: userHabits,
    logs,
    streaks: userStreaks,
    goals: userGoals,
  });

  const aiReport = await generateAIWeeklyReport(prompt);

  const report: WeeklyReport = {
    title: aiReport.title || "Weekly Habit Report",

    summary: aiReport.summary || "Your weekly progress summary.",

    strengths: aiReport.strengths || [],

    improvements: aiReport.improvements || [],

    recommendations: aiReport.recommendations || [],
  };

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

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
