import { Habit, HabitLog, Streak } from "@/drizzle/schema";

import { calculateWeeklyGrade } from "@/lib/analytics/weekly-grade";
import { calculateHabitHealth } from "@/lib/analytics/habit-health";
import { generateInsights } from "@/lib/insights/generateInsights";
import { predictStreakRisk } from "@/lib/analytics/streak-prediction";

export interface AIContext {
  generatedAt: Date;

  completionRate: number;

  completedToday: number;

  totalHabits: number;

  weeklyGrade: ReturnType<typeof calculateWeeklyGrade>;

  healthScores: ReturnType<typeof calculateHabitHealth>;

  streakPredictions: ReturnType<typeof predictStreakRisk>;

  insights: string[];

  strongestHabit: string | null;

  weakestHabit: string | null;
}

export function buildAIContext(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): AIContext {
  //----------------------------------------
  // Dashboard numbers
  //----------------------------------------

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

  //----------------------------------------
  // Analytics
  //----------------------------------------

  const weeklyGrade = calculateWeeklyGrade(habits, logs, streaks);

  const healthScores = calculateHabitHealth(habits, logs, streaks);

  const predictions = predictStreakRisk(habits, logs, streaks);

  const insights = generateInsights({
    habits,
    logs,
    streaks,
  });

  //----------------------------------------
  // Strongest / weakest
  //----------------------------------------

  const sorted = [...healthScores].sort((a, b) => b.score - a.score);

  const strongestHabit = sorted.length > 0 ? sorted[0].title : null;

  const weakestHabit =
    sorted.length > 0 ? sorted[sorted.length - 1].title : null;

  //----------------------------------------

  return {
    generatedAt: new Date(),

    completionRate,

    completedToday,

    totalHabits,

    weeklyGrade,

    healthScores,

    streakPredictions: predictions,

    insights,

    strongestHabit,

    weakestHabit,
  };
}
