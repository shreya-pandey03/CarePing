"use server";

import { and, eq } from "drizzle-orm";
import { differenceInCalendarDays } from "date-fns";

import { db } from "@/lib/db";
import { auth } from "@/auth";

import { habits, habitLogs, streaks } from "@/drizzle/schema";

interface UpdateStreakParams {
  habitId: string;
}

interface UpdateStreakResult {
  success: boolean;

  currentStreak: number;

  longestStreak: number;

  riskScore: number;

  message: string;
}

function calculateRiskScore(currentStreak: number, daysMissed: number) {
  if (daysMissed >= 3) return 100;

  if (daysMissed === 2) return 75;

  if (daysMissed === 1) return 40;

  if (currentStreak >= 100) return 5;

  if (currentStreak >= 30) return 10;

  if (currentStreak >= 7) return 20;

  return 30;
}

export async function updateStreaks({
  habitId,
}: UpdateStreakParams): Promise<UpdateStreakResult> {
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

  const log = await db.query.habitLogs.findFirst({
    where: and(eq(habitLogs.habitId, habitId), eq(habitLogs.userId, userId)),
    orderBy: (logs, { desc }) => [desc(logs.completedAt)],
  });

  let streak = await db.query.streaks.findFirst({
    where: eq(streaks.habitId, habitId),
  });

  if (!streak) {
    const id = crypto.randomUUID();

    await db.insert(streaks).values({
      id,

      userId,

      habitId,

      currentStreak: 0,

      longestStreak: 0,

      totalCompletions: 0,

      riskScore: 0,
    });

    streak = await db.query.streaks.findFirst({
      where: eq(streaks.habitId, habitId),
    });
  }

  if (!streak) {
    throw new Error("Unable to initialize streak.");
  }

  const today = new Date();

  const lastCompleted = streak.lastCompletedAt;
  let currentStreak = streak.currentStreak;

  let longestStreak = streak.longestStreak;

  let totalCompletions = streak.totalCompletions;

  let riskScore = streak.riskScore;

  // First completion

  if (!lastCompleted) {
    currentStreak = 1;

    longestStreak = 1;

    totalCompletions++;

    riskScore = calculateRiskScore(currentStreak, 0);
  } else {
    const daysDifference = differenceInCalendarDays(today, lastCompleted);

    // Already completed today

    if (daysDifference === 0) {
      return {
        success: true,

        currentStreak,

        longestStreak,

        riskScore,

        message: "Habit already completed today.",
      };
    }

    // Continue streak

    if (daysDifference === 1) {
      currentStreak += 1;

      totalCompletions++;

      longestStreak = Math.max(longestStreak, currentStreak);

      riskScore = calculateRiskScore(currentStreak, 0);
    }

    // Broken streak

    if (daysDifference > 1) {
      currentStreak = 1;

      totalCompletions++;

      riskScore = calculateRiskScore(currentStreak, daysDifference - 1);
    }
  }

  await db
    .update(streaks)
    .set({
      currentStreak,

      longestStreak,

      totalCompletions,

      riskScore,

      lastCompletedAt: today,

      updatedAt: today,
    })
    .where(eq(streaks.id, streak.id));

  return {
    success: true,

    currentStreak,

    longestStreak,

    riskScore,

    message: "Streak updated successfully.",
  };
}
