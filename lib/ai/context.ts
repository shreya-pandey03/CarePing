import { Habit, HabitLog, Streak } from "@/drizzle/schema";

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

export function buildAIContext(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): AIContext {
  // ----------------------------------------
  // Dashboard numbers
  // ----------------------------------------

  const today = new Date();

  const todayString = today.toDateString();

  const completedToday = new Set(
    logs
      .filter((log) => log.completedAt.toDateString() === todayString)
      .map((log) => log.habitId),
  ).size;

  const totalHabits = habits.length;

  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  // ----------------------------------------
  // Weekly analytics
  // ----------------------------------------

  const weeklyGrade = calculateWeeklyGrade(habits, logs, streaks);

  // ----------------------------------------
  // Habit health
  // ----------------------------------------

  const healthScores = habits.map((habit) => {
    const streak = streaks.find((streak) => streak.habitId === habit.id);

    const health = calculateHabitHealth(habit, logs, streak);

    return {
      ...health,
      title: habit.title,
    };
  });

  // ----------------------------------------
  // Streak predictions
  // ----------------------------------------

  const streakPredictions = habits.map((habit) => {
    const streak = streaks.find((streak) => streak.habitId === habit.id);

    const prediction = predictStreakRisk(habit, logs, streak);

    return {
      ...prediction,
      title: habit.title,
    };
  });

  // ----------------------------------------
  // AI insights
  // ----------------------------------------

  const insights = generateInsights({
    habits,
    logs,
    streaks,
  });

  // ----------------------------------------
  // Strongest / weakest habit
  // ----------------------------------------

  const sorted = [...healthScores].sort((a, b) => b.score - a.score);

  const strongestHabit = sorted.length > 0 ? sorted[0].title : null;

  const weakestHabit =
    sorted.length > 0 ? sorted[sorted.length - 1].title : null;

  // ----------------------------------------
  // Final AI context
  // ----------------------------------------

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
