import type { Habit, HabitLog, Streak } from "@/drizzle/schema";
import { startOfWeek } from "date-fns";

import { calculateWeeklyGrade } from "@/lib/analytics/weekly-grade";
import { generateInsights } from "@/lib/insights/generateInsights";
import { predictStreakRisk } from "@/lib/analytics/streak-prediction";
import { calculateHabitHealth } from "@/lib/analytics/habit-health";

export interface AIContext {
  generatedAt: Date;

  today: string;
  weekStart: string;

  completionRate: number;
  completedToday: number;
  totalHabits: number;

  weeklyCompletedCount: number;
  weeklyExpectedCount: number;
  weeklyMissedCount: number;

  weeklyGrade: ReturnType<typeof calculateWeeklyGrade>;

  healthScores: Array<
    ReturnType<typeof calculateHabitHealth> & {
      title: string;
    }
  >;

  streakPredictions: Array<
    ReturnType<typeof predictStreakRisk> & {
      title: string;
      currentStreak: number;
      longestStreak: number;
      totalCompletions: number;
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
  const now = new Date();
  const weekStart = startOfWeek(now);

  const totalHabits = habits.filter(
    (habit) => habit.active && !habit.archived,
  ).length;

  const activeHabitIds = new Set(
    habits
      .filter((habit) => habit.active && !habit.archived)
      .map((habit) => habit.id),
  );

  const completedToday = new Set(
    logs
      .filter(
        (log) =>
          log.completed &&
          activeHabitIds.has(log.habitId) &&
          isSameDay(new Date(log.completedAt), now),
      )
      .map((log) => log.habitId),
  ).size;

  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  const weeklyGrade = calculateWeeklyGrade(habits, logs, streaks);

  const weeklyLogs = logs.filter((log) => {
    const completedAt = new Date(log.completedAt);

    return (
      log.completed &&
      activeHabitIds.has(log.habitId) &&
      completedAt >= weekStart
    );
  });

  const weeklyCompletedCount = weeklyLogs.length;

  const weeklyExpectedCount = Math.max(
    0,
    Math.round(
      weeklyGrade.averageCompletion > 0
        ? weeklyCompletedCount / (weeklyGrade.averageCompletion / 100)
        : 0,
    ),
  );

  const weeklyMissedCount = Math.max(
    0,
    weeklyExpectedCount - weeklyCompletedCount,
  );

  const healthScores = habits
    .filter((habit) => habit.active && !habit.archived)
    .map((habit) => {
      const streak = streaks.find((item) => item.habitId === habit.id);

      const health = calculateHabitHealth(habit, logs, streak);

      return {
        ...health,
        title: habit.title.trim(),
      };
    });

  const streakPredictions = habits
    .filter((habit) => habit.active && !habit.archived)
    .map((habit) => {
      const streak = streaks.find((item) => item.habitId === habit.id);

      const prediction = predictStreakRisk(habit, logs, streak);

      return {
        ...prediction,
        title: habit.title.trim(),
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
        totalCompletions: streak?.totalCompletions ?? 0,
      };
    });

  const sortedHealthScores = [...healthScores].sort(
    (a, b) => b.score - a.score,
  );

  const strongestHabit =
    sortedHealthScores.length > 0 ? sortedHealthScores[0].title : null;

  const weakestHabit =
    sortedHealthScores.length > 0
      ? sortedHealthScores[sortedHealthScores.length - 1].title
      : null;

  const insights = generateInsights({
    habits,
    logs,
    streaks,
  });

  return {
    generatedAt: new Date(),

    today: now.toISOString().split("T")[0],
    weekStart: weekStart.toISOString().split("T")[0],

    completionRate,
    completedToday,
    totalHabits,

    weeklyCompletedCount,
    weeklyExpectedCount,
    weeklyMissedCount,

    weeklyGrade,

    healthScores,

    streakPredictions,

    insights,

    strongestHabit,
    weakestHabit,
  };
}
