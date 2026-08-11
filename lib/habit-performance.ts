import type { habits, habitLogs, streaks } from "@/drizzle/schema";

import { calculateHabitMetrics } from "@/lib/analytics/metrics";

type Habit = typeof habits.$inferSelect;
type HabitLog = typeof habitLogs.$inferSelect;
type Streak = typeof streaks.$inferSelect;

export function calculateHabitPerformance(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
) {
  const metrics = calculateHabitMetrics(habit, logs, streak);

  return {
    habitId: metrics.habitId,

    title: metrics.title,

    totalCompleted: metrics.totalCompletions,

    completionRate: metrics.completionRate,

    currentStreak: metrics.currentStreak,

    longestStreak: metrics.longestStreak,

    lastCompleted: metrics.lastCompletedAt,
  };
}
