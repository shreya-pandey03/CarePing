"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { redis } from "@/lib/redis";

import { generateInsight } from "@/lib/gemini";
import { buildHabitSuggestionPrompt } from "@/lib/promptBuilder";

import { habits, goals, streaks } from "@/drizzle/schema";

interface HabitSuggestion {
  title: string;
  description: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  reason: string;
}

interface GenerateHabitSuggestionsResult {
  success: boolean;
  suggestions: HabitSuggestion[];
}

const CACHE_TTL = 60 * 60 * 24;

export async function generateHabitSuggestions(): Promise<GenerateHabitSuggestionsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const cacheKey = `habit-suggestions:${userId}`;

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

  const prompt = buildHabitSuggestionPrompt({
    habits: userHabits,
    goals: userGoals,
    streaks: userStreaks,
  });

  const ai = await generateInsight(prompt);

  let suggestions: HabitSuggestion[] = [];

  try {
    const json = JSON.parse(ai.content);

    suggestions = json.suggestions ?? [];
  } catch (error) {
    console.error("Failed to parse habit suggestions:", error);
    suggestions = [];
  }

  const result: GenerateHabitSuggestionsResult = {
    success: true,
    suggestions,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return result;
}
