"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { generateInsight } from "@/lib/gemini";
import { buildCorrelationPrompt } from "@/lib/promptBuilder";

import {
  habits,
  habitLogs,
  streaks,
  habitCorrelations,
} from "@/drizzle/schema";

interface CorrelationInsight {
  habitAId: string;
  habitBId: string;
  correlationScore: number;
  insight: string;
}

interface GenerateCorrelationInsightsResult {
  success: boolean;
  correlations: CorrelationInsight[];
}

const CACHE_TTL = 60 * 60 * 24;

export async function generateCorrelationInsights(): Promise<GenerateCorrelationInsightsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const cacheKey = `habit-correlations:${userId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch user data
  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  // Build Gemini prompt
  const prompt = buildCorrelationPrompt({
    habits: userHabits,
    logs,
    streaks: userStreaks,
    goals: []
  });

  // Generate AI response
  const aiResult = await generateInsight(prompt);

  let correlations: CorrelationInsight[] = [];

  try {
    correlations = JSON.parse(aiResult.content);
  } catch (error) {
    console.error("Failed to parse AI correlations:", error);
    correlations = [];
  }

  // Save correlations
  for (const correlation of correlations) {
    await db.insert(habitCorrelations).values({
      id: crypto.randomUUID(),
      userId,
      habitAId: correlation.habitAId,
      habitBId: correlation.habitBId,
      correlationScore: correlation.correlationScore,
      insight: correlation.insight,
      createdAt: new Date(),
    });
  }

  const result: GenerateCorrelationInsightsResult = {
    success: true,
    correlations,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
