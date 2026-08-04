import { and, eq, gte, lte } from "drizzle-orm";
import { startOfWeek, endOfWeek, format } from "date-fns";

import { db } from "@/lib/db";
import { habits, habitLogs } from "@/drizzle/schema";

export async function getWeeklyAnalytics(userId: string) {
  const start = startOfWeek(new Date(), {
    weekStartsOn: 0,
  });

  const end = endOfWeek(new Date(), {
    weekStartsOn: 0,
  });

  const userHabits = await db.query.habits.findMany({
    where: and(eq(habits.userId, userId), eq(habits.active, true)),
  });

  const logs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.userId, userId),
      gte(habitLogs.completedAt, start),
      lte(habitLogs.completedAt, end),
    ),
  });

  const totalHabits = userHabits.length;

  const completedHabits = new Set(logs.map((log) => log.habitId)).size;

  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  return {
    totalHabits,
    completedHabits,
    completionRate,
    currentWeek: `${format(start, "d/M/yyyy")} - ${format(end, "d/M/yyyy")}`,
  };
}
