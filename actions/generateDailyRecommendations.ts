"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { generateInsight } from "@/lib/gemini";
import { buildRecommendationPrompt } from "@/lib/promptBuilder";

import { habits, goals, streaks, recommendations } from "@/drizzle/schema";

interface DailyRecommendation {
  title: string;
  description: string;
  priority: number;
}

interface GenerateRecommendationResult {
  success: boolean;
  recommendations: DailyRecommendation[];
}

const CACHE_TTL = 60 * 60 * 24;

export async function generateDailyRecommendation(): Promise<GenerateRecommendationResult> {
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

  const userGoals = await db.query.goals.findMany({
    where: eq(goals.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const prompt = buildRecommendationPrompt({
    habits: userHabits,
    goals: userGoals,
    logs: [],
    streaks: userStreaks,
  });

  const ai = await generateInsight(prompt);

  let parsed: DailyRecommendation[] = [];

  try {
    const json = JSON.parse(ai.content);

    parsed = json.recommendations ?? [];
  } catch (err) {
    console.error(err);
    parsed = [];
  }

  const createdRecommendations: DailyRecommendation[] = [];

  for (const item of parsed) {
    await db.insert(recommendations).values({
      id: crypto.randomUUID(),
      userId,
      habitId: null,
      type: "daily",
      title: item.title,
      description: item.description,
      priority: item.priority,
      accepted: false,
      dismissed: false,
      createdAt: new Date(),
    });

    createdRecommendations.push(item);
  }

  const result: GenerateRecommendationResult = {
    success: true,
    recommendations: createdRecommendations,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
