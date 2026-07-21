import { db } from "@/lib/db";

import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

export interface DashboardRealtimeData {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

export async function getDashboardRealtimeData(
  userId: string,
): Promise<DashboardRealtimeData> {
  // Total habits
  const totalHabits = await db.$count(habits, eq(habits.userId, userId));

  // Active habits
  const activeHabits = await db.$count(
    habits,
    and(eq(habits.userId, userId), eq(habits.active, true)),
  );

  // Today's completion
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedTodayResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(habitLogs)
    .where(sql`${habitLogs.completedAt} >= ${today}`);

  const completedToday = Number(completedTodayResult[0]?.count ?? 0);

  // Streaks
  const streakData = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const currentStreak = Math.max(0, ...streakData.map((s) => s.currentStreak));

  const longestStreak = Math.max(0, ...streakData.map((s) => s.longestStreak));

  // Completion %
  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  return {
    totalHabits,
    activeHabits,
    completedToday,
    currentStreak,
    longestStreak,
    completionRate,
  };
}
