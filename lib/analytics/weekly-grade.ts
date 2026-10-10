import type { Habit, HabitLog, Streak } from "@/drizzle/schema";
import {
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  startOfWeek,
} from "date-fns";

export type WeeklyGrade = {
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  averageCompletion: number;
  completedHabits: number;
  totalHabits: number;
  completedCompletions: number;
  expectedCompletions: number;
  missedCompletions: number;
  weeklyLongestStreak: number;
  missedHabits: number;
  feedback: string;
};

export function calculateWeeklyGrade(
  habits: Habit[],
  logs: HabitLog[],
  _streaks: Streak[],
): WeeklyGrade {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const activeHabits = habits.filter(
    (habit) => habit.active && !habit.archived,
  );

  const activeHabitIds = new Set(activeHabits.map((habit) => habit.id));

  const weeklyLogs = logs.filter((log) => {
    const completedAt = new Date(log.completedAt);

    return (
      log.completed &&
      activeHabitIds.has(log.habitId) &&
      completedAt >= weekStart &&
      completedAt <= now &&
      completedAt <= weekEnd
    );
  });

  const completedDatesByHabit = new Map<string, Set<string>>();

  for (const log of weeklyLogs) {
    const date = new Date(log.completedAt);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (!completedDatesByHabit.has(log.habitId)) {
      completedDatesByHabit.set(log.habitId, new Set());
    }

    completedDatesByHabit.get(log.habitId)!.add(dayKey);
  }

  const completedHabits = completedDatesByHabit.size;
  const totalHabits = activeHabits.length;
  const daysElapsedThisWeek = differenceInCalendarDays(now, weekStart) + 1;

  let expectedCompletions = 0;
  let completedCompletions = 0;
  let missedHabits = 0;

  for (const habit of activeHabits) {
    const targetDays = Math.max(1, habit.targetDays ?? 1);
    const completedThisWeek = completedDatesByHabit.get(habit.id)?.size ?? 0;

    completedCompletions += completedThisWeek;

    let expectedForHabit = 0;

    if (habit.frequency === "daily") {
      expectedForHabit = daysElapsedThisWeek * targetDays;
    } else if (habit.frequency === "weekly") {
      expectedForHabit = targetDays;
    } else if (habit.frequency === "monthly") {
      const daysInMonth = endOfMonth(now).getDate();
      expectedForHabit = Math.ceil(targetDays * (now.getDate() / daysInMonth));
    }

    expectedCompletions += expectedForHabit;

    if (completedThisWeek < expectedForHabit) {
      missedHabits++;
    }
  }

  const missedCompletions = Math.max(
    0,
    expectedCompletions - completedCompletions,
  );

  const averageCompletion =
    expectedCompletions === 0
      ? 0
      : Math.min(
          100,
          Math.round((completedCompletions / expectedCompletions) * 100),
        );

  const weeklyLongestStreak = activeHabits.reduce((maxStreak, habit) => {
    const uniqueDates = [...(completedDatesByHabit.get(habit.id) ?? [])]
      .map((dayKey) => {
        const [year, month, day] = dayKey.split("-").map(Number);
        return new Date(year, month, day).getTime();
      })
      .sort((a, b) => a - b);

    let currentStreak = 0;
    let longestStreak = 0;

    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const difference = differenceInCalendarDays(
          new Date(uniqueDates[i]),
          new Date(uniqueDates[i - 1]),
        );

        currentStreak = difference === 1 ? currentStreak + 1 : 1;
      }

      longestStreak = Math.max(longestStreak, currentStreak);
    }

    return Math.max(maxStreak, longestStreak);
  }, 0);

  let score = averageCompletion * 0.75;
  score += Math.min(weeklyLongestStreak * 1.5, 15);

  if (totalHabits > 0 && missedHabits === 0) {
    score += 10;
  }

  score = Math.min(100, Math.round(score));

  let grade: WeeklyGrade["grade"];

  if (score >= 95) grade = "A+";
  else if (score >= 85) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 55) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  const feedback: Record<WeeklyGrade["grade"], string> = {
    "A+": "Outstanding week. Your habits are becoming automatic.",
    A: "Excellent consistency. Keep protecting your streaks.",
    B: "Good progress. Keep improving your consistency across all habits.",
    C: "You're improving, but consistency needs attention.",
    D: "Several habit targets were missed this week. Focus on building consistency.",
    F: "Let's restart small. Completing your next planned habit builds momentum.",
  };

  return {
    score,
    grade,
    averageCompletion,
    completedHabits,
    totalHabits,
    completedCompletions,
    expectedCompletions,
    missedCompletions,
    weeklyLongestStreak,
    missedHabits,
    feedback: feedback[grade],
  };
}
