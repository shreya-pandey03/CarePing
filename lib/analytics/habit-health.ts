import type { InferSelectModel } from "drizzle-orm";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

type Habit = InferSelectModel<typeof habits>;
type HabitLog = InferSelectModel<typeof habitLogs>;
type Streak = InferSelectModel<typeof streaks>;

export type HabitHealthStatus = "excellent" | "good" | "warning" | "critical";

export type HabitHealth = {
  habitId: string;
  habitTitle: string;
  score: number;
  status: HabitHealthStatus;
  completionRate: number;
  currentStreak: number;
  totalCompletions: number;
  daysSinceLastCompletion: number | null;
  completedToday: boolean;
  recommendation: string;
};

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function calculateHabitHealth(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
): HabitHealth {
  /* HABIT LOGS*/

  const habitLogs = logs
    .filter((log) => log.habitId === habit.id)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  const totalCompletions = habitLogs.length;

  const currentStreak = streak?.currentStreak ?? 0;

  const today = new Date();

  /*COMPLETED TODAY*/

  const completedToday = habitLogs.some((log) =>
    isSameDay(new Date(log.completedAt), today),
  );

  /* LAST COMPLETION*/

  const latestLog = habitLogs[0];

  const daysSinceLastCompletion = latestLog
    ? Math.max(
        0,
        Math.floor(
          (today.getTime() - new Date(latestLog.completedAt).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  /*
   * COMPLETION RATE
   * Calculate based on days since habit creation.
   * Example:
   * Habit created 10 days ago
   * Completed 7 times
   * Completion = 70%
   */

  const habitCreatedAt = new Date(habit.createdAt);

  const daysSinceCreated = Math.max(
    1,
    Math.floor(
      (today.getTime() - habitCreatedAt.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  );

  const completionRate =
    totalCompletions === 0
      ? 0
      : Math.min(100, Math.round((totalCompletions / daysSinceCreated) * 100));

  /*
   * HEALTH SCORE
   * Completion       = 50 points
   * Consistency      = 20 points
   * Current streak   = 20 points
   * Today status     = 10 points
   * Total             = 100
   */

  const completionScore = completionRate * 0.5;

  /*
   * Recent consistency.
   *
   * Look at the last 7 days.
   */

  let recentCompletions = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);

    date.setHours(0, 0, 0, 0);

    date.setDate(today.getDate() - i);

    const completedThatDay = habitLogs.some((log) =>
      isSameDay(new Date(log.completedAt), date),
    );

    if (completedThatDay) {
      recentCompletions++;
    }
  }

  const consistencyRate = Math.round((recentCompletions / 7) * 100);

  const consistencyScore = consistencyRate * 0.2;

  /* STREAK SCORE*/

  const streakScore = Math.min(currentStreak * 2, 20);

  /*TODAY SCORE*/

  const todayScore = completedToday ? 10 : 0;

  /*FINAL HEALTH SCORE*/

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(completionScore + consistencyScore + streakScore + todayScore),
    ),
  );

  /* HEALTH STATUS*/

  const status: HabitHealthStatus =
    score >= 80
      ? "excellent"
      : score >= 60
        ? "good"
        : score >= 35
          ? "warning"
          : "critical";

  /*RECOMMENDATION*/

  let recommendation: string;

  if (!completedToday) {
    recommendation = "Complete this habit today to keep your momentum going.";
  } else {
    switch (status) {
      case "excellent":
        recommendation = "Excellent consistency. Keep your current routine.";
        break;

      case "good":
        recommendation = "Your habit is progressing well. Stay consistent.";
        break;

      case "warning":
        recommendation =
          "Your consistency is slipping. Try maintaining your routine.";
        break;

      default:
        recommendation =
          "This habit needs attention. Restart with a small achievable goal.";
    }
  }

  /*
   * RETURN*/

  return {
    habitId: habit.id,
    habitTitle: habit.title,
    score,
    status,
    completionRate,
    currentStreak,
    totalCompletions,
    daysSinceLastCompletion,
    completedToday,
    recommendation,
  };
}
