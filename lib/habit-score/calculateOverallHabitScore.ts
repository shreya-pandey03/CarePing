import type { Habit, HabitLog, Streak } from "@/drizzle/schema";
import { calculateHabitScore } from "./calculateHabitScore";

export function calculateOverallHabitScore(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): number {
  if (habits.length === 0) {
    return 0;
  }

  const scores = habits.map((habit) => {
    const habitLogs = logs.filter(
      (log) => log.habitId === habit.id && log.completed,
    );

    const streak = streaks.find((item) => item.habitId === habit.id);

    const completionRate = Math.min(
      Math.round((habitLogs.length / 30) * 100),
      100,
    );

    return calculateHabitScore({
      completionRate,
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      totalCompleted: habitLogs.length,
    }).score;
  });

  return Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length,
  );
}
