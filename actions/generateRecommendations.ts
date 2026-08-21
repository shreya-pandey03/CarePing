"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

import { generateHabitRecommendations } from "@/lib/recommendations/recommendation-engine";

export async function generateRecommendations() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const [userHabits, logs, userStreaks] = await Promise.all([
    db.query.habits.findMany({
      where: eq(habits.userId, userId),
    }),

    db.query.habitLogs.findMany({
      where: eq(habitLogs.userId, userId),
    }),

    db.query.streaks.findMany({
      where: eq(streaks.userId, userId),
    }),
  ]);

  return generateHabitRecommendations(userHabits, logs, userStreaks);
}
