import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { habits, habitLogs } from "@/drizzle/schema";

export type MonthlyAnalytics = {
  completionRate: number;
  completedHabits: number;
  totalHabits: number;
  month: string;
  year: number;
};

export async function getMonthlyAnalytics(
  userId: string,
): Promise<MonthlyAnalytics> {
  const now = new Date();

  const month = now.toLocaleString("default", {
    month: "long",
  });

  const year = now.getFullYear();

  const userHabits = await db.query.habits.findMany({
    where: and(eq(habits.userId, userId), eq(habits.active, true)),
  });

  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const monthlyLogs = logs.filter((log) => {
    const date = new Date(log.completedAt);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  // Count each habit only once
  const completedHabits = new Set(monthlyLogs.map((log) => log.habitId)).size;

  const totalHabits = userHabits.length;

  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  return {
    completionRate,
    completedHabits,
    totalHabits,
    month,
    year,
  };
}
