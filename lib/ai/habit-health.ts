import type { Habit, HabitLog, Streak } from "@/drizzle/schema";

export type HabitHealth = {
  habitId: string;
  title: string;

  score: number;

  status: "Excellent" | "Good" | "Needs Attention";

  completionRate: number;

  currentStreak: number;

  completedToday: boolean;
};

export function calculateHabitHealth(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): HabitHealth[] {
  const today = new Date();

  return habits.map((habit) => {
    const habitLogs = logs.filter((log) => log.habitId === habit.id);

    const streak = streaks.find((s) => s.habitId === habit.id);

    //----------------------------------------
    // Completion %
    //----------------------------------------

    const daysAlive = Math.max(
      1,
      Math.ceil(
        (today.getTime() - new Date(habit.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );

    const completionRate = Math.min(
      100,
      Math.round((habitLogs.length / daysAlive) * 100),
    );

    //----------------------------------------
    // Completed today?
    //----------------------------------------

    const completedToday = habitLogs.some((log) => {
      const d = new Date(log.completedAt);

      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });

    //----------------------------------------
    // Score
    //----------------------------------------

    let score = 0;

    // Completion
    score += completionRate * 0.4;

    // Current streak
    score += Math.min((streak?.currentStreak ?? 0) * 5, 25);

    // Today
    if (completedToday) score += 20;

    // Longest streak

    score += Math.min(streak?.longestStreak ?? 0, 10);

    // Clamp

    score = Math.min(100, Math.round(score));

    //----------------------------------------
    // Status
    //----------------------------------------

    let status: HabitHealth["status"];

    if (score >= 85) status = "Excellent";
    else if (score >= 60) status = "Good";
    else status = "Needs Attention";

    return {
      habitId: habit.id,
      title: habit.title,
      score,
      status,
      completionRate,
      currentStreak: streak?.currentStreak ?? 0,
      completedToday,
    };
  });
}
