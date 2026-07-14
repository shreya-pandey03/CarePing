"use server";

import { and, eq, gte, lte } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { generateInsight } from "@/lib/gemini";
import { buildMonthlyReportPrompt } from "@/lib/promptBuilder";

import {
  habits,
  habitLogs,
  streaks,
  goals,
  monthlyReports,
} from "@/drizzle/schema";

interface MonthlyReport {
  title: string;
  summary: string;
  achievements: string[];
  challenges: string[];
  recommendations: string[];
  motivation: string;
}

interface GenerateMonthlyReportResult {
  success: boolean;
  report: MonthlyReport;
}

const CACHE_TTL = 60 * 60 * 24 * 30;

export async function generateMonthlyReport(): Promise<GenerateMonthlyReportResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const cacheKey = `monthly-report:${userId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const monthEnd = new Date();

  const monthStart = new Date();
  monthStart.setDate(monthEnd.getDate() - 29);

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const logs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.userId, userId),
      gte(habitLogs.completedAt, monthStart),
      lte(habitLogs.completedAt, monthEnd),
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
      : Math.round((logs.length / (userHabits.length * 30)) * 100);

  const prompt = buildMonthlyReportPrompt({
    habits: userHabits,
    logs,
    streaks: userStreaks,
    goals: userGoals,
  });

  const aiResult = await generateInsight(prompt);

  const report: MonthlyReport = {
    title: aiResult.title,
    summary: aiResult.summary,
    achievements: [],
    challenges: [],
    recommendations: [],
    motivation: aiResult.content,
  };

  await db.insert(monthlyReports).values({
    id: crypto.randomUUID(),
    userId,
    month: monthStart.getMonth() + 1,
    year: monthStart.getFullYear(),
    completionRate,
    totalHabits: userHabits.length,
    completedHabits: logs.length,
    report: JSON.stringify(report),
    aiSummary: report.summary,
    generatedAt: new Date(),
  });

  const result: GenerateMonthlyReportResult = {
    success: true,
    report,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
