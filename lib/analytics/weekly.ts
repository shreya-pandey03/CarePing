import { db } from "@/lib/db";
import { habits, habitLogs } from "@/drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

import { getWeekRange } from "./helpers";
import { calculateCompletionRate } from "./completion";

export async function getWeeklyAnalytics(userId: string) {
  const { start, end } = getWeekRange();

  const userHabits = await db.query.habits.findMany({
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
    totalHabits: userHabits.length,

    completedHabits: completed.length,

    completionRate: calculateCompletionRate(
      completed.length,
      userHabits.length,
    ),

    currentWeek: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
  };
}
