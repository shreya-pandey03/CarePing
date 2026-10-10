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

function isSameDay(date1: Date, date2: Date): boolean {
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
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });

  const activeHabits = habits.filter(
    (habit) => habit.active && !habit.archived,
  );

  const activeHabitIds = new Set(activeHabits.map((habit) => habit.id));

  const activeLogs = logs.filter(
    (log) => activeHabitIds.has(log.habitId) && log.completed,
  );

  const totalHabits = activeHabits.length;

  const completedToday = new Set(
    activeLogs
      .filter((log) => isSameDay(new Date(log.completedAt), now))
      .map((log) => log.habitId),
  ).size;

  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  const activeStreaks = streaks.filter((streak) =>
    activeHabitIds.has(streak.habitId),
  );

  const weeklyGrade = calculateWeeklyGrade(
    activeHabits,
    activeLogs,
    activeStreaks,
  );

  const weeklyCompletedCount = weeklyGrade.completedCompletions;
  const weeklyExpectedCount = weeklyGrade.expectedCompletions;
  const weeklyMissedCount = weeklyGrade.missedCompletions;

  const healthScores = activeHabits.map((habit) => {
    const streak = activeStreaks.find((item) => item.habitId === habit.id);

    return {
      ...calculateHabitHealth(habit, activeLogs, streak),
      title: habit.title.trim(),
    };
  });

  const streakPredictions = activeHabits.map((habit) => {
    const streak = activeStreaks.find((item) => item.habitId === habit.id);

    return {
      ...predictStreakRisk(habit, activeLogs, streak),
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
    habits: activeHabits,
    logs: activeLogs,
    streaks: activeStreaks,
  });

  return {
    generatedAt: now,
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
