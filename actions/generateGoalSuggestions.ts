"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { redis } from "@/lib/redis";

import { generateInsight } from "@/lib/gemini";
import { buildGoalSuggestionPrompt } from "@/lib/promptBuilder";
import { goals, habits, streaks } from "@/drizzle/schema";

interface GoalSuggestion {
  title: string;
  description: string;
  targetValue: number;
  deadline: string;
  reason: string;
}

interface GenerateGoalSuggestionsResult {
  success: boolean;
  suggestions: GoalSuggestion[];
}

const CACHE_TTL = 60 * 60 * 24;

export async function generateGoalSuggestions(): Promise<GenerateGoalSuggestionsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const cacheKey = `goal-suggestions:${userId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const userGoals = await db.query.goals.findMany({
    where: eq(goals.userId, userId),
  });

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const prompt = buildGoalSuggestionPrompt({
    goals: userGoals,
    habits: userHabits,
    streaks: userStreaks,
  });

  const ai = await generateInsight(prompt);

  let suggestions: GoalSuggestion[] = [];

  try {
    const json = JSON.parse(ai.content);

    suggestions = json.suggestions ?? [];
  } catch (error) {
    console.error("Failed to parse goal suggestions:", error);
    suggestions = [];
  }

  const result: GenerateGoalSuggestionsResult = {
    success: true,
    suggestions,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
