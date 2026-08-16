import { and, eq, gte, lt } from "drizzle-orm";

import { db } from "@/lib/db";
import { habits, habitLogs } from "@/drizzle/schema";

export async function getYearlyAnalytics(userId: string) {
  const now = new Date();

  const year = now.getFullYear();

  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const userHabits = await db.query.habits.findMany({
    where: and(eq(habits.userId, userId), eq(habits.active, true)),
  });

  const logs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.userId, userId),
      gte(habitLogs.completedAt, start),
      lt(habitLogs.completedAt, end),
    ),
  });

  const totalHabits = userHabits.length;

  const completedHabits = new Set(logs.map((log) => log.habitId)).size;

  const daysElapsed =
    Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const totalPossible = totalHabits * daysElapsed;

  const completionRate =
    totalPossible > 0
      ? Math.min(Math.round((logs.length / totalPossible) * 100), 100)
      : 0;

  return {
    year,
    totalHabits,
    completedHabits,
    completionRate,
  };
}
