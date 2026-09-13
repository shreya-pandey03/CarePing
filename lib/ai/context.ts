import type { Habit, HabitLog, Streak } from "@/drizzle/schema";

import { calculateWeeklyGrade } from "@/lib/analytics/weekly-grade";
import { generateInsights } from "@/lib/insights/generateInsights";
import { predictStreakRisk } from "@/lib/analytics/streak-prediction";
import { calculateHabitHealth } from "@/lib/analytics/habit-health";

export interface AIContext {
  generatedAt: Date;

  completionRate: number;
  completedToday: number;
  totalHabits: number;

  weeklyGrade: ReturnType<typeof calculateWeeklyGrade>;

  healthScores: Array<
    ReturnType<typeof calculateHabitHealth> & {
      title: string;
    }
  >;

  streakPredictions: Array<
    ReturnType<typeof predictStreakRisk> & {
      title: string;
    }
  >;

  insights: string[];

  strongestHabit: string | null;
  weakestHabit: string | null;
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function buildAIContext(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): AIContext {
  const today = new Date();
  /*
   * 1. Basic habit statistics
   */

  const totalHabits = habits.length;

  /*
   * Find habits completed today.
   *
   * Set() prevents duplicate logs for the same habit
   * from being counted more than once.
   */
  const completedToday = new Set(
    logs
      .filter((log) => log.completed && isSameDay(log.completedAt, today))
      .map((log) => log.habitId),
  ).size;

  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  /*
   * ---------------------------------------------------------
   * 2. Weekly performance
   * ---------------------------------------------------------
   */

  const weeklyGrade = calculateWeeklyGrade(habits, logs, streaks);

  /*
   * ---------------------------------------------------------
   * 3. Habit health scores
   * ---------------------------------------------------------
   */

  const healthScores = habits.map((habit) => {
    const streak = streaks.find((item) => item.habitId === habit.id);

    const health = calculateHabitHealth(habit, logs, streak);

    return {
      ...health,
      title: habit.title.trim(),
    };
  });

  /*
   * ---------------------------------------------------------
   * 4. Streak risk predictions
   * ---------------------------------------------------------
   */

  const streakPredictions = habits.map((habit) => {
    const streak = streaks.find((item) => item.habitId === habit.id);

    const prediction = predictStreakRisk(habit, logs, streak);

    return {
      ...prediction,
      title: habit.title.trim(),
    };
  });

  /*
   * ---------------------------------------------------------
   * 5. Strongest and weakest habits
   * ---------------------------------------------------------
   */

  const sortedHealthScores = [...healthScores].sort(
    (a, b) => b.score - a.score,
  );

  const strongestHabit =
    sortedHealthScores.length > 0 ? sortedHealthScores[0].title : null;

  const weakestHabit =
    sortedHealthScores.length > 0
      ? sortedHealthScores[sortedHealthScores.length - 1].title
      : null;

  /*
   * ---------------------------------------------------------
   * 6. Rule-based insights
   * ---------------------------------------------------------
   */

  const insights = generateInsights({
    habits,
    logs,
    streaks,
  });

  /*
   * ---------------------------------------------------------
   * 7. Final AI context
   * ---------------------------------------------------------
   */

  return {
    generatedAt: new Date(),

    completionRate,
    completedToday,
    totalHabits,

    weeklyGrade,

    healthScores,

    streakPredictions,

    insights,

    strongestHabit,
    weakestHabit,
  };
}
