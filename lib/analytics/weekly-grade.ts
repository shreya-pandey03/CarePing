import type { Habit, HabitLog, Streak } from "@/drizzle/schema";
import { startOfWeek } from "date-fns";

export type WeeklyGrade = {
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  averageCompletion: number;
  completedHabits: number;
  totalHabits: number;
  longestStreak: number;
  missedHabits: number;
  feedback: string;
};

export function calculateWeeklyGrade(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): WeeklyGrade {
  const weekStart = startOfWeek(new Date());

  const weeklyLogs = logs.filter(
    (log) => new Date(log.completedAt) >= weekStart,
  );

  //------------------------------------------
  // Habits completed this week
  //------------------------------------------

  const completedHabits = new Set(weeklyLogs.map((l) => l.habitId)).size;

  const totalHabits = habits.length;

  const averageCompletion =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  //------------------------------------------
  // Longest streak
  //------------------------------------------

  const longestStreak = Math.max(0, ...streaks.map((s) => s.longestStreak));

  //------------------------------------------
  // Missed
  //------------------------------------------

  const missedHabits = totalHabits - completedHabits;

  //------------------------------------------
  // Score
  //------------------------------------------

  let score = 0;

  // Completion contributes up to 60 points
  score += averageCompletion * 0.6;

  // Longest streak contributes up to 25 points
  score += Math.min(longestStreak * 2.5, 25);

  // Bonus for completing all habits
  if (completedHabits === totalHabits && totalHabits > 0) {
    score += 15;
  }

  score = Math.min(100, Math.round(score));

  //------------------------------------------
  // Grade
  //------------------------------------------

  let grade: WeeklyGrade["grade"];

  if (score >= 95) grade = "A+";
  else if (score >= 85) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 55) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  //------------------------------------------
  // Feedback
  //------------------------------------------

  let feedback = "";

  switch (grade) {
    case "A+":
      feedback = "Outstanding week. Your habits are becoming automatic.";
      break;

    case "A":
      feedback = "Excellent consistency. Keep protecting your streaks.";
      break;

    case "B":
      feedback =
        "Good progress. Completing every habit daily will push you higher.";
      break;

    case "C":
      feedback = "You're improving, but consistency needs attention.";
      break;

    case "D":
      feedback =
        "Several habits were missed this week. Focus on one habit at a time.";
      break;

    case "F":
      feedback =
        "Let's restart small. Completing even one habit today builds momentum.";
      break;
  }

  return {
    score,
    grade,
    averageCompletion,
    completedHabits,
    totalHabits,
    longestStreak,
    missedHabits,
    feedback,
  };
}
