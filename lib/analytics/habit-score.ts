import type { InferSelectModel } from "drizzle-orm";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

type Habit = InferSelectModel<typeof habits>;
type HabitLog = InferSelectModel<typeof habitLogs>;
type Streak = InferSelectModel<typeof streaks>;

export type HabitScore = {
  score: number;
  completionScore: number;
  consistencyScore: number;
  streakScore: number;
  status: "Excellent" | "Good" | "Fair" | "Needs Attention";
};

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

export function calculateHabitScore(
  habitsList: Habit[],
  logs: HabitLog[],
  streaksList: Streak[],
): HabitScore {
  if (habitsList.length === 0) {
    return {
      score: 0,
      completionScore: 0,
      consistencyScore: 0,
      streakScore: 0,
      status: "Needs Attention",
    };
  }

  /*
   * 1. COMPLETION SCORE
   * Measures how often habits were completed during the
   * available tracking period.
   */

  const activeHabits = habitsList.filter((habit) => habit.active);

  const totalHabits =
    activeHabits.length > 0 ? activeHabits.length : habitsList.length;

  const totalCompletions = logs.filter((log) => log.completed).length;

  /*
   * Use the number of tracked days rather than today's
   * completion so the score represents long-term behavior.
   */

  const uniqueDates = new Set(
    logs
      .filter((log) => log.completed)
      .map((log) => getDateKey(new Date(log.completedAt))),
  );

  const trackedDays = Math.max(uniqueDates.size, 1);

  const possibleCompletions = Math.max(totalHabits * trackedDays, 1);

  const completionRate = Math.min(
    100,
    Math.round((totalCompletions / possibleCompletions) * 100),
  );

  const completionScore = completionRate;

  /*
   * 2. CONSISTENCY SCORE
   * Measures how regularly the user completes habits.
   * Instead of simply counting total completions, we look
   * at how many tracked days contained activity.
   */

  const consistencyRate = Math.min(
    100,
    Math.round((uniqueDates.size / trackedDays) * 100),
  );

  /*
   * The calculation above naturally becomes 100 when all
   * tracked days contain activity.
   *
   * We slightly normalize it so a very small amount of
   * history does not immediately produce a perfect score.
   */

  const historyFactor = Math.min(uniqueDates.size / 14, 1);

  const consistencyScore = Math.round(
    consistencyRate * (0.5 + historyFactor * 0.5),
  );

  /*
   * 3. STREAK SCORE
   */

  const streakValues = streaksList
    .filter((streak) => habitsList.some((habit) => habit.id === streak.habitId))
    .map((streak) => streak.currentStreak);

  const longestCurrentStreak =
    streakValues.length > 0 ? Math.max(...streakValues) : 0;

  /*
   * 30 consecutive days = 100 streak score.
   */

  const streakScore = Math.min(
    100,
    Math.round((longestCurrentStreak / 30) * 100),
  );

  /*
   * 4. FINAL SCORE
   * Completion  = 40%
   * Consistency = 35%
   * Streak      = 25%
   */

  const score = Math.round(
    completionScore * 0.4 + consistencyScore * 0.35 + streakScore * 0.25,
  );

  /*
   * 5. STATUS
   */

  const status =
    score >= 80
      ? "Excellent"
      : score >= 65
        ? "Good"
        : score >= 45
          ? "Fair"
          : "Needs Attention";

  return {
    score,
    completionScore,
    consistencyScore,
    streakScore,
    status,
  };
}
