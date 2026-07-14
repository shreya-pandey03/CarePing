"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { generateInsight } from "@/lib/gemini";
import { buildInsightPrompt } from "@/lib/promptBuilder";

import {
  habits,
  habitLogs,
  streaks,
  goals,
  aiInsights,
} from "@/drizzle/schema";

interface Insight {
  title: string;
  summary: string;
  content: string;
}

interface GenerateInsightsResult {
  success: boolean;
  insights: Insight[];
}

const CACHE_TTL = 60 * 60 * 24;

export async function generateInsights(): Promise<GenerateInsightsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const cacheKey = `ai-insights:${userId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const userLogs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const userGoals = await db.query.goals.findMany({
    where: eq(goals.userId, userId),
  });

  const prompt = buildInsightPrompt({
    habits: userHabits,
    logs: userLogs,
    streaks: userStreaks,
    goals: userGoals,
  });

  const insight = await generateInsight(prompt);

  await db.insert(aiInsights).values({
    id: crypto.randomUUID(),
    userId,
    title: insight.title,
    summary: insight.summary,
    content: insight.content,
    metadata: null,
    createdAt: new Date(),
  });

  const result: GenerateInsightsResult = {
    success: true,
    insights: [insight],
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
