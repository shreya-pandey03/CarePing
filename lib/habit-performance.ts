import type { Habit, HabitLog, Streak } from "@/drizzle/schema";

export function calculateHabitPerformance(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
) {
  const habitLogs = logs.filter((log) => log.habitId === habit.id);

  const totalCompleted = habitLogs.length;

  const today = new Date();

  const daysSinceCreated = Math.max(
    1,
    Math.ceil(
      (today.getTime() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  let expected = daysSinceCreated;

  if (habit.frequency === "weekly") {
    expected = Math.ceil(daysSinceCreated / 7);
  }

  if (habit.frequency === "monthly") {
    expected = Math.ceil(daysSinceCreated / 30);
  }

  const completionRate = Math.min(
    100,
    Math.round((totalCompleted / Math.max(expected, 1)) * 100),
  );

  const lastCompleted =
    habitLogs.length > 0
      ? [...habitLogs].sort(
          (a, b) => b.completedAt.getTime() - a.completedAt.getTime(),
        )[0].completedAt
      : null;

  return {
    habitId: habit.id,
    title: habit.title,
    totalCompleted,
    completionRate,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
    lastCompleted,
  };
}
