import type { InferSelectModel } from "drizzle-orm";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

type Habit = InferSelectModel<typeof habits>;
type HabitLog = InferSelectModel<typeof habitLogs>;
type Streak = InferSelectModel<typeof streaks>;

export type HabitHealthStatus = "excellent" | "good" | "warning" | "critical";

export type HabitHealth = {
  habitId: string;
  score: number;
  status: HabitHealthStatus;
  completionRate: number;
  currentStreak: number;
  totalCompletions: number;
  daysSinceLastCompletion: number | null;
  recommendation: string;
};

export function calculateHabitHealth(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
): HabitHealth {
  const habitLogs = logs
    .filter((log) => log.habitId === habit.id)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  const totalCompletions = habitLogs.length;
  const currentStreak = streak?.currentStreak ?? 0;

  const latestLog = habitLogs[0];

  const daysSinceLastCompletion = latestLog
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(latestLog.completedAt).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  /*
   * Basic health calculation.
   *
   * This is intentionally deterministic.
   * Later this can be enhanced with AI predictions.
   */

  const completionScore = Math.min(totalCompletions * 5, 40);

  const streakScore = Math.min(currentStreak * 2, 30);

  let recencyScore = 0;

  if (daysSinceLastCompletion === null) {
    recencyScore = 0;
  } else if (daysSinceLastCompletion === 0) {
    recencyScore = 30;
  } else if (daysSinceLastCompletion === 1) {
    recencyScore = 20;
  } else if (daysSinceLastCompletion === 2) {
    recencyScore = 10;
  }

  const score = Math.max(
    0,
    Math.min(100, completionScore + streakScore + recencyScore),
  );

  const status: HabitHealthStatus =
    score >= 80
      ? "excellent"
      : score >= 60
        ? "good"
        : score >= 35
          ? "warning"
          : "critical";

  const completionRate =
    totalCompletions === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (totalCompletions /
              Math.max(currentStreak || 1, totalCompletions)) *
              100,
          ),
        );

  let recommendation: string;

  switch (status) {
    case "excellent":
      recommendation = "Excellent consistency. Keep your current routine.";

      break;

    case "good":
      recommendation = "Your habit is progressing well. Stay consistent.";

      break;

    case "warning":
      recommendation =
        "Your consistency is slipping. Try completing this habit today.";

      break;

    default:
      recommendation =
        "This habit needs attention. Restart with a small achievable goal.";
  }

  return {
    habitId: habit.id,
    score,
    status,
    completionRate,
    currentStreak,
    totalCompletions,
    daysSinceLastCompletion,
    recommendation,
  };
}
