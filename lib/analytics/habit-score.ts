import type { InferSelectModel } from "drizzle-orm";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

type Habit = InferSelectModel<typeof habits>;
type HabitLog = InferSelectModel<typeof habitLogs>;
type Streak = InferSelectModel<typeof streaks>;

export type HabitScoreResult = {
  score: number;
  completionScore: number;
  consistencyScore: number;
  streakScore: number;
  status: "excellent" | "good" | "fair" | "needs-attention";
  label: string;
};

/**
 * Calculate the overall score of a single habit.
 *
 * Score breakdown:
 *
 * Completion    -> 50 points
 * Consistency   -> 30 points
 * Streak        -> 20 points
 *
 * Total         -> 100 points
 */
export function calculateHabitScore(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
): HabitScoreResult {
  const habitLogs = logs.filter(
    (log) => log.habitId === habit.id && log.completed,
  );

  const totalCompletions = habitLogs.length;

  /**
   * -------------------------
   * 1. COMPLETION SCORE
   * -------------------------
   *
   * We use the last 30 days as the primary measurement.
   */
  const now = new Date();

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const recentLogs = habitLogs.filter((log) => {
    const date = new Date(log.completedAt);

    return date >= thirtyDaysAgo && date <= now;
  });

  /**
   * For a daily habit:
   * 30 possible days.
   *
   * For weekly/monthly habits we still use the same
   * recent activity window, but avoid allowing the
   * denominator to become unrealistically large.
   */
  let expectedCompletions = 30;

  if (habit.frequency === "weekly") {
    expectedCompletions = 4;
  }

  if (habit.frequency === "monthly") {
    expectedCompletions = 1;
  }

  const completionRate = Math.min(
    100,
    Math.round((recentLogs.length / expectedCompletions) * 100),
  );

  const completionScore = Math.round(
    (completionRate / 100) * 50,
  );

  /**
   * -------------------------
   * 2. CONSISTENCY SCORE
   * -------------------------
   *
   * We look at the spacing between completions.
   *
   * A habit completed regularly gets a higher score.
   */
  const sortedLogs = [...habitLogs].sort(
    (a, b) =>
      new Date(a.completedAt).getTime() -
      new Date(b.completedAt).getTime(),
  );

  let consistencyRate = 0;

  if (sortedLogs.length >= 2) {
    const intervals: number[] = [];

    for (let i = 1; i < sortedLogs.length; i++) {
      const previous = new Date(sortedLogs[i - 1].completedAt);
      const current = new Date(sortedLogs[i].completedAt);

      const days =
        (current.getTime() - previous.getTime()) /
        (1000 * 60 * 60 * 24);

      intervals.push(days);
    }

    const averageInterval =
      intervals.reduce((sum, value) => sum + value, 0) /
      intervals.length;

    /**
     * Ideal interval:
     *
     * daily   -> 1 day
     * weekly  -> 7 days
     * monthly -> 30 days
     */
    const idealInterval =
      habit.frequency === "daily"
        ? 1
        : habit.frequency === "weekly"
          ? 7
          : 30;

    const deviation = Math.abs(
      averageInterval - idealInterval,
    );

    consistencyRate = Math.max(
      0,
      Math.min(
        100,
        Math.round(100 - (deviation / idealInterval) * 100),
      ),
    );
  } else if (sortedLogs.length === 1) {
    /**
     * One completion means there is not enough history
     * to confidently measure consistency.
     */
    consistencyRate = 20;
  }

  const consistencyScore = Math.round(
    (consistencyRate / 100) * 30,
  );

  /**
   * -------------------------
   * 3. STREAK SCORE
   * -------------------------
   */

  const currentStreak = streak?.currentStreak ?? 0;

  const streakScore = Math.min(
    20,
    currentStreak * 2,
  );

  /**
   * -------------------------
   * FINAL SCORE
   * -------------------------
   */

  const score = Math.max(
    0,
    Math.min(
      100,
      completionScore +
        consistencyScore +
        streakScore,
    ),
  );

  /**
   * -------------------------
   * STATUS
   * -------------------------
   */

  let status: HabitScoreResult["status"];

  if (score >= 80) {
    status = "excellent";
  } else if (score >= 65) {
    status = "good";
  } else if (score >= 45) {
    status = "fair";
  } else {
    status = "needs-attention";
  }

  const label =
    status === "excellent"
      ? "Excellent"
      : status === "good"
        ? "Good"
        : status === "fair"
          ? "Fair"
          : "Needs Attention";

  return {
    score,
    completionScore,
    consistencyScore,
    streakScore,
    status,
    label,
  };
}

/**
 * Calculate the overall score for all habits.
 *
 * This is what should power:
 *
 * Habit Score
 * 62 / 100
 *
 * on the dashboard.
 */
export function calculateOverallHabitScore(
  habitsList: Habit[],
  logs: HabitLog[],
  streaksList: Streak[],
): number {
  if (habitsList.length === 0) {
    return 0;
  }

  const scores = habitsList.map((habit) => {
    const streak = streaksList.find(
      (item) => item.habitId === habit.id,
    );

    return calculateHabitScore(
      habit,
      logs,
      streak,
    ).score;
  });

  const total = scores.reduce(
    (sum, score) => sum + score,
    0,
  );

  return Math.round(total / scores.length);
}