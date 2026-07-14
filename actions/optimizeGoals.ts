"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { generateGoalOptimization } from "@/lib/gemini";
import { buildGoalOptimizationPrompt } from "@/lib/promptBuilder";

import { goals } from "@/drizzle/schema";

interface GoalSuggestion {
  title: string;
  description: string;
  targetValue: number;
  deadline: string;
  reason: string;
}

interface OptimizeGoalResult {
  success: boolean;
  suggestions: GoalSuggestion[];
}

const CACHE_TTL = 60 * 60 * 24;

export async function optimizeGoal(): Promise<OptimizeGoalResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const cacheKey = `goal-optimization:${userId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const userGoals = await db.query.goals.findMany({
    where: eq(goals.userId, userId),
  });

  const prompt = buildGoalOptimizationPrompt({
    goals: userGoals,
  });

  const suggestions = await generateGoalOptimization(prompt);

  const result: OptimizeGoalResult = {
    success: true,
    suggestions,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
