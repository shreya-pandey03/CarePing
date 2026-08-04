import {
  and,
  eq,
  gte,
} from "drizzle-orm";

import {
  startOfMonth,
} from "date-fns";

import {
  db,
} from "@/lib/db";

import {
  habits,
  habitLogs,
} from "@/drizzle/schema";

export async function getMonthlyAnalytics(
  userId: string
) {
  const start =
    startOfMonth(new Date());

  const userHabits =
    await db.query.habits.findMany({
      where: and(
        eq(habits.userId, userId),
        eq(habits.active, true),
      ),
    });

  const logs =
    await db.query.habitLogs.findMany({
      where: and(
        eq(habitLogs.userId, userId),
        gte(
          habitLogs.completedAt,
          start
        ),
      ),
    });

  const uniqueHabits =
    new Set(
      logs.map((l) => l.habitId)
    );

  const completedHabits =
    uniqueHabits.size;

  const totalHabits =
    userHabits.length;

  const completionRate =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedHabits /
            totalHabits) *
            100
        );
  return {
    completedHabits,
    totalHabits,
    completionRate,

    month:
      start.getMonth() + 1,

    year:
      start.getFullYear(),
  };
}