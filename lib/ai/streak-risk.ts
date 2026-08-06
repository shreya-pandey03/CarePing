import type { Habit, HabitLog, Streak } from "@/drizzle/schema";

export type StreakRisk = {
  habitId: string;
  habit: string;

  risk: "low" | "medium" | "high";

  score: number;

  recommendation: string;
};

export function calculateStreakRisk(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): StreakRisk[] {
  const today = new Date();

  return habits.map((habit) => {
    const habitLogs = logs
      .filter((log) => log.habitId === habit.id)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      );

    const streak = streaks.find((s) => s.habitId === habit.id);

    let score = 0;

    //-----------------------------------
    // Completed today?
    //-----------------------------------

    const completedToday = habitLogs.some((log) => {
      const d = new Date(log.completedAt);

      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });

    if (!completedToday) score += 35;

    //-----------------------------------
    // Current streak
    //-----------------------------------

    const currentStreak = streak?.currentStreak ?? 0;

    if (currentStreak === 0) score += 25;
    else if (currentStreak < 3) score += 15;
    else if (currentStreak < 7) score += 5;

    //-----------------------------------
    // Last completion age
    //-----------------------------------

    if (habitLogs.length > 0) {
      const last = new Date(habitLogs[0].completedAt);

      const diff = (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

      if (diff >= 2) score += 25;
      else if (diff >= 1) score += 10;
    } else {
      score += 30;
    }

    //-----------------------------------
    // Completion consistency
    //-----------------------------------

    const daysAlive = Math.max(
      1,
      Math.ceil(
        (today.getTime() - new Date(habit.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );

    const consistency = (habitLogs.length / daysAlive) * 100;

    if (consistency < 40) score += 20;
    else if (consistency < 70) score += 10;

    //-----------------------------------
    // Clamp score
    //-----------------------------------

    score = Math.max(0, Math.min(score, 100));

    //-----------------------------------
    // Risk level
    //-----------------------------------

    let risk: "low" | "medium" | "high";

    if (score >= 70) risk = "high";
    else if (score >= 35) risk = "medium";
    else risk = "low";

    //-----------------------------------
    // Recommendation
    //-----------------------------------

    let recommendation = "";

    switch (risk) {
      case "low":
        recommendation = "You're doing great. Keep your streak alive.";
        break;

      case "medium":
        recommendation =
          "Complete this habit today to avoid breaking momentum.";
        break;

      case "high":
        recommendation =
          "This streak is in danger. Try completing even a small version of the habit now.";
        break;
    }

    return {
      habitId: habit.id,
      habit: habit.title,
      risk,
      score,
      recommendation,
    };
  });
}
