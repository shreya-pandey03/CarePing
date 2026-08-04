import { and, eq, gte } from "drizzle-orm";

import { db } from "@/lib/db";
import { habits, habitLogs } from "@/drizzle/schema";

export async function getDashboardAnalytics(userId: string) {
  const userHabits = await db.query.habits.findMany({
    where: and(eq(habits.userId, userId), eq(habits.active, true)),
  });

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  const todayLogs = await db.query.habitLogs.findMany({
    where: and(eq(habitLogs.userId, userId), gte(habitLogs.completedAt, today)),
  });
  const completedHabitIds = new Set(todayLogs.map((log) => log.habitId));
  const completedToday = completedHabitIds.size;
  const totalHabits = userHabits.length;
  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  return {
    totalHabits,
    completedToday,
    completionRate,
  };
}
