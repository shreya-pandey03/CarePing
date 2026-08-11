import type { habits, habitLogs, streaks } from "@/drizzle/schema";

type Habit = typeof habits.$inferSelect;
type HabitLog = typeof habitLogs.$inferSelect;
type Streak = typeof streaks.$inferSelect;

export interface HabitMetrics {
  habitId: string;
  title: string;

  totalCompletions: number;

  completionRate: number;
  consistency: number;

  currentStreak: number;
  longestStreak: number;

  lastCompletedAt: Date | null;

  completedToday: boolean;

  healthScore: number;
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function differenceInDays(date1: Date, date2: Date) {
  const first = startOfDay(date1).getTime();
  const second = startOfDay(date2).getTime();

  return Math.floor(Math.abs(first - second) / (1000 * 60 * 60 * 24));
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

export function calculateHabitMetrics(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
  today = new Date(),
): HabitMetrics {
  const habitLogs = logs
    .filter((log) => log.habitId === habit.id && log.completed)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  const totalCompletions = habitLogs.length;

  const createdAt = startOfDay(new Date(habit.createdAt));

  const currentDay = startOfDay(today);

  const daysSinceCreated = Math.max(
    1,
    differenceInDays(currentDay, createdAt) + 1,
  );

  /*
   * Completion rate:
   *
   * Number of completed days / number of days
   * the habit has existed.
   *
   * This prevents values above 100%.
   */
  const completedDates = new Set(
    habitLogs.map((log) => startOfDay(new Date(log.completedAt)).getTime()),
  );

  const completionRate = clamp(
    Math.round((completedDates.size / daysSinceCreated) * 100),
  );

  /*
   * Consistency is based on the recent 30 days.
   */
  const thirtyDaysAgo = new Date(currentDay);

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const recentDates = new Set(
    habitLogs
      .filter((log) => new Date(log.completedAt) >= thirtyDaysAgo)
      .map((log) => startOfDay(new Date(log.completedAt)).getTime()),
  );

  const consistency = clamp(Math.round((recentDates.size / 30) * 100));

  const todayStart = startOfDay(today);

  const completedToday = habitLogs.some(
    (log) =>
      startOfDay(new Date(log.completedAt)).getTime() === todayStart.getTime(),
  );

  const lastCompletedAt =
    habitLogs.length > 0 ? new Date(habitLogs[0].completedAt) : null;

  /*
   * Habit health:
   *
   * Completion 40%
   * Consistency 30%
   * Current streak 30%
   */
  const streakScore = clamp((streak?.currentStreak ?? 0) * 10);

  const healthScore = Math.round(
    completionRate * 0.4 + consistency * 0.3 + streakScore * 0.3,
  );

  return {
    habitId: habit.id,
    title: habit.title,

    totalCompletions,

    completionRate,
    consistency,

    currentStreak: streak?.currentStreak ?? 0,

    longestStreak: streak?.longestStreak ?? 0,

    lastCompletedAt,

    completedToday,

    healthScore: clamp(healthScore),
  };
}
