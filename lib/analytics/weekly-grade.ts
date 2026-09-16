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
  weeklyLongestStreak: number;
  missedHabits: number;
  feedback: string;
};

export function calculateWeeklyGrade(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): WeeklyGrade {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const activeHabits = habits.filter(
    (habit) => habit.active && !habit.archived,
  );

  const weeklyLogs = logs.filter((log) => {
    const completedAt = new Date(log.completedAt);

    return (
      log.completed &&
      completedAt >= weekStart &&
      completedAt <= weekEnd
    );
  });

  const completedHabits = new Set(
    weeklyLogs.map((log) => log.habitId),
  ).size;

  const totalHabits = activeHabits.length;

  const daysElapsedThisWeek =
    differenceInCalendarDays(now, weekStart) + 1;

  let expectedCompletions = 0;
  let completedCompletions = 0;

  for (const habit of activeHabits) {
    const targetDays = Math.max(1, habit.targetDays);

    const completedThisWeek = new Set(
      weeklyLogs
        .filter((log) => log.habitId === habit.id)
        .map((log) => {
          const date = new Date(log.completedAt);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        }),
    ).size;

    completedCompletions += completedThisWeek;

    if (habit.frequency === "daily") {
      expectedCompletions +=
        Math.min(daysElapsedThisWeek, 7) * targetDays;
    }

    if (habit.frequency === "weekly") {
      expectedCompletions += targetDays;
    }

    if (habit.frequency === "monthly") {
      const daysInMonth = endOfMonth(now).getDate();

      const monthProgress =
        now.getDate() / daysInMonth;

      const monthlyExpected =
        targetDays * monthProgress;

      const weekExpected = Math.min(
        targetDays,
        monthlyExpected,
      );

      expectedCompletions += weekExpected;
    }
  }

  const averageCompletion =
    expectedCompletions === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (completedCompletions /
              expectedCompletions) *
              100,
          ),
        );

  const weeklyLongestStreak = activeHabits.reduce(
    (maxStreak, habit) => {
      const habitDates = weeklyLogs
        .filter((log) => log.habitId === habit.id)
        .map((log) => {
          const date = new Date(log.completedAt);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        });

      const uniqueDates = [
        ...new Set(habitDates),
      ].sort((a, b) => a - b);

      let currentStreak = 0;
      let longestStreak = 0;

      for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0) {
          currentStreak = 1;
        } else {
          const previous = new Date(
            uniqueDates[i - 1],
          );

          const current = new Date(
            uniqueDates[i],
          );

          const difference =
            differenceInCalendarDays(
              current,
              previous,
            );

          currentStreak =
            difference === 1
              ? currentStreak + 1
              : 1;
        }

        longestStreak = Math.max(
          longestStreak,
          currentStreak,
        );
      }

      return Math.max(
        maxStreak,
        longestStreak,
      );
    },
    0,
  );

  const missedHabits = activeHabits.filter(
    (habit) => {
      const completedThisWeek =
        weeklyLogs.filter(
          (log) => log.habitId === habit.id,
        ).length;

      const targetDays = Math.max(
        1,
        habit.targetDays,
      );

      if (habit.frequency === "daily") {
        const expected =
          Math.min(daysElapsedThisWeek, 7) *
          targetDays;

        return completedThisWeek < expected;
      }

      if (habit.frequency === "weekly") {
        return completedThisWeek < targetDays;
      }

      if (habit.frequency === "monthly") {
        const daysInMonth =
          endOfMonth(now).getDate();

        const expected =
          Math.min(
            targetDays,
            targetDays *
              (now.getDate() /
                daysInMonth),
          );

        return completedThisWeek < expected;
      }

      return false;
    },
  ).length;

  let score = 0;

  score += averageCompletion * 0.75;

  score += Math.min(
    weeklyLongestStreak * 1.5,
    15,
  );

  if (
    totalHabits > 0 &&
    missedHabits === 0
  ) {
    score += 10;
  }

  score = Math.min(
    100,
    Math.round(score),
  );

  let grade: WeeklyGrade["grade"];

  if (score >= 95) grade = "A+";
  else if (score >= 85) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 55) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  let feedback = "";

  switch (grade) {
    case "A+":
      feedback =
        "Outstanding week. Your habits are becoming automatic.";
      break;

    case "A":
      feedback =
        "Excellent consistency. Keep protecting your streaks.";
      break;

    case "B":
      feedback =
        "Good progress. Keep improving your consistency across all habits.";
      break;

    case "C":
      feedback =
        "You're improving, but consistency needs attention.";
      break;

    case "D":
      feedback =
        "Several habit targets were missed this week. Focus on building consistency.";
      break;

    case "F":
      feedback =
        "Let's restart small. Completing your next planned habit builds momentum.";
      break;
  }

  return {
    score,
    grade,
    averageCompletion,
    completedHabits,
    totalHabits,
    weeklyLongestStreak,
    missedHabits,
    feedback,
  };
}