import { db } from "@/lib/db";
import { habits, habitLogs } from "@/drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

import { getMonthRange } from "./helpers";
import { calculateCompletionRate } from "./completion";

export async function getMonthlyAnalytics(userId: string) {
  const { start, end } = getMonthRange();

  const habitsList = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const completed = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.userId, userId),
      gte(habitLogs.completedAt, start),
      lte(habitLogs.completedAt, end),
    ),
  });

  return {
    totalHabits: habitsList.length,

    completedHabits: completed.length,

    completionRate: calculateCompletionRate(
      completed.length,
      habitsList.length,
    ),

    month: start.getMonth() + 1,

    year: start.getFullYear(),
  };
}
