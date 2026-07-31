import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { eq, and, gte } from "drizzle-orm";

import { calculateCompletionRate } from "./completion";

export async function getDashboardAnalytics(userId: string) {
  const today = new Date();

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const completedToday = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.userId, userId),
      gte(habitLogs.completedAt, new Date(today.setHours(0, 0, 0, 0))),
    ),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const longestStreak =
    userStreaks.length === 0
      ? 0
      : Math.max(...userStreaks.map((s) => s.longestStreak));

  const currentStreak = userStreaks.reduce(
    (acc, item) => acc + item.currentStreak,
    0,
  );

  return {
    totalHabits: userHabits.length,

    activeHabits: userHabits.filter((h) => h.active).length,

    completedToday: completedToday.length,

    currentStreak,

    longestStreak,

    completionRate: calculateCompletionRate(
      completedToday.length,
      userHabits.length,
    ),
  };
}
