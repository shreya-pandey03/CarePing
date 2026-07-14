"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";

import { habits, streaks } from "@/drizzle/schema";

interface PredictStreakParams {
  habitId: string;
}

export interface StreakPredictionResult {
  success: boolean;

  riskScore: number;

  confidence: number;

  level: "low" | "medium" | "high";

  recommendation: string;

  currentStreak: number;

  longestStreak: number;
}

function calculateConfidence(currentStreak: number, longestStreak: number) {
  if (longestStreak === 0) {
    return 50;
  }

  const confidence = Math.round((currentStreak / longestStreak) * 100);

  return Math.min(100, confidence);
}

function getRiskLevel(score: number): "low" | "medium" | "high" {
  if (score >= 70) {
    return "high";
  }

  if (score >= 40) {
    return "medium";
  }

  return "low";
}

function buildRecommendation(level: "low" | "medium" | "high") {
  switch (level) {
    case "high":
      return "Your streak is at high risk. Complete this habit today and consider setting a reminder.";

    case "medium":
      return "Stay consistent. Completing this habit today will help maintain your momentum.";

    default:
      return "You're doing great. Keep your routine consistent to maintain your streak.";
  }
}

export async function predictStreak({
  habitId,
}: PredictStreakParams): Promise<StreakPredictionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const habit = await db.query.habits.findFirst({
    where: eq(habits.id, habitId),
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const streak = await db.query.streaks.findFirst({
    where: eq(streaks.habitId, habitId),
  });

  if (!streak) {
    throw new Error("Streak not found");
  }
  if (streak.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const confidence = calculateConfidence(
    streak.currentStreak,
    streak.longestStreak,
  );

  const level = getRiskLevel(streak.riskScore);

  const recommendation = buildRecommendation(level);

  return {
    success: true,

    riskScore: streak.riskScore,

    confidence,

    level,

    recommendation,

    currentStreak: streak.currentStreak,

    longestStreak: streak.longestStreak,
  };
}
