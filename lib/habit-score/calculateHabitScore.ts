import type { HabitScore } from "./types";

export interface HabitScoreInput {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

export function calculateHabitScore(input: HabitScoreInput): HabitScore {
  const { completionRate, currentStreak, longestStreak, totalCompleted } =
    input;

  // 40% — how often the habit is completed
  const completionScore = Math.min(Math.max(completionRate, 0), 100);

  // 25% — consistency based on streak
  const consistencyScore =
    longestStreak > 0
      ? Math.min((currentStreak / longestStreak) * 100, 100)
      : 0;

  // 25% — reward sustained streaks
  const streakScore = Math.min(currentStreak * 10, 100);

  // 10% — basic recovery/activity signal
  const recoveryScore = totalCompleted > 0 ? 100 : 0;

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
