import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { habits, habitLogs } from "@/drizzle/schema";

export async function getMonthlyAnalytics(userId: string) {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const start = new Date(year, now.getMonth(), 1);
  const end = new Date(year, now.getMonth() + 1, 1);

  const userHabits = await db.query.habits.findMany({
    where: and(eq(habits.userId, userId), eq(habits.active, true)),
  });

  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const monthlyLogs = logs.filter(
    (log) => log.completedAt >= start && log.completedAt < end,
  );

  const totalHabits = userHabits.length;

  const completedHabits = new Set(monthlyLogs.map((log) => log.habitId)).size;

  const totalPossible = totalHabits * now.getDate();

  const completionRate =
    totalPossible > 0
      ? Math.round((monthlyLogs.length / totalPossible) * 100)
      : 0;

  return {
    totalHabits,
    completedHabits,
    completionRate: Math.min(completionRate, 100),
    month,
    year,
  };
}
