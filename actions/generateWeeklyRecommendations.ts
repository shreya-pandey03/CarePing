"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { generateRecommendations } from "@/lib/gemini";
import { buildRecommendationPrompt } from "@/lib/promptBuilder";

import {
  habits,
  habitLogs,
  goals,
  streaks,
  recommendations,
} from "@/drizzle/schema";

interface DailyRecommendation {
  title: string;
  description: string;
  priority: number;
}

interface GenerateDailyRecommendationResult {
  success: boolean;
  recommendations: DailyRecommendation[];
}

const CACHE_TTL = 60 * 60 * 24;

export async function generateDailyRecommendation(): Promise<GenerateDailyRecommendationResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const cacheKey = `daily-recommendations:${userId}`;

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

  const userGoals = await db.query.goals.findMany({
    where: eq(goals.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const prompt = buildRecommendationPrompt({
    habits: userHabits,
    logs: userLogs,
    goals: userGoals,
    streaks: userStreaks,
  });

  const aiResponse = await generateRecommendations(prompt);

  const savedRecommendations: DailyRecommendation[] = [];

  for (const text of aiResponse.recommendations) {
    const recommendation: DailyRecommendation = {
      title: "Daily Recommendation",
      description: text,
      priority: 1,
    };

    await db.insert(recommendations).values({
      id: crypto.randomUUID(),
      userId,
      habitId: null,
      type: "daily",
      title: recommendation.title,
      description: recommendation.description,
      priority: recommendation.priority,
      accepted: false,
      dismissed: false,
      createdAt: new Date(),
    });

    savedRecommendations.push(recommendation);
  }

  const result: GenerateDailyRecommendationResult = {
    success: true,
    recommendations: savedRecommendations,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
