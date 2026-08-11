import type { HabitScore } from "./types";

interface HabitPerformance {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

export function calculateOverallHabitScore(
  habits: HabitPerformance[],
): HabitScore {
  if (habits.length === 0) {
    return {
      score: 0,
      label: "Needs Attention",
      completionScore: 0,
      consistencyScore: 0,
      streakScore: 0,
      recoveryScore: 0,
    };
  }

  const completionScore =
    habits.reduce((sum, habit) => sum + habit.completionRate, 0) /
    habits.length;

  const consistencyScore =
    habits.reduce(
      (sum, habit) =>
        sum +
        (habit.longestStreak > 0
          ? Math.min((habit.currentStreak / habit.longestStreak) * 100, 100)
          : 0),
      0,
    ) / habits.length;

  const streakScore =
    habits.reduce(
      (sum, habit) => sum + Math.min(habit.currentStreak * 10, 100),
      0,
    ) / habits.length;

  const recoveryScore =
    (habits.filter((habit) => habit.totalCompleted > 0).length /
      habits.length) *
    100;

  const score = Math.round(
    completionScore * 0.4 +
      consistencyScore * 0.25 +
      streakScore * 0.25 +
      recoveryScore * 0.1,
  );

  let label: HabitScore["label"];

  if (score >= 90) {
    label = "Excellent";
  } else if (score >= 75) {
    label = "Good";
  } else if (score >= 50) {
    label = "Fair";
  } else {
    label = "Needs Attention";
  }

  return {
    score,
    label,
    completionScore: Math.round(completionScore),
    consistencyScore: Math.round(consistencyScore),
    streakScore: Math.round(streakScore),
    recoveryScore: Math.round(recoveryScore),
  };
}
