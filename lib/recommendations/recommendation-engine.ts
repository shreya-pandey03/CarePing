import type { Habit, HabitLog, Streak } from "@/drizzle/schema";
import type { HabitRecommendation } from "./types";

export function generateHabitRecommendations(
  habits: Habit[],
  logs: HabitLog[],
  streaks: Streak[],
): HabitRecommendation[] {
  const recommendations: HabitRecommendation[] = [];

  for (const habit of habits) {
    const streak = streaks.find((item) => item.habitId === habit.id);

    const habitLogs = logs.filter(
      (log) => log.habitId === habit.id && log.completed,
    );

    const currentStreak = streak?.currentStreak ?? 0;

    const recentLogs = habitLogs.filter((log) => {
      const date = new Date(log.completedAt);
      const now = new Date();

      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      return diff <= 7;
    });

    const completionRate = Math.round((recentLogs.length / 7) * 100);

    if (currentStreak >= 7) {
      recommendations.push({
        habitId: habit.id,
        habitTitle: habit.title,
        type: "streak",
        priority: "low",
        title: "Protect your streak",
        message: `You've maintained a ${currentStreak}-day streak with ${habit.title}.`,
        action: "Keep your current routine consistent.",
        id: "",
        habit: "",
        category: "streak",
        recommendation: "",
        reason: "",
        expectedImpact: "",
      });
    }

    if (completionRate < 50) {
      recommendations.push({
        habitId: habit.id,
        habitTitle: habit.title,
        type: "consistency",
        priority: "high",
        title: "Improve consistency",
        message: `${habit.title} has only been completed about ${completionRate}% of the last 7 days.`,
        action: "Start with one small completion each day.",
        id: "",
        habit: "",
        category: "streak",
        recommendation: "",
        reason: "",
        expectedImpact: "",
      });
    } else if (completionRate < 75) {
      recommendations.push({
        habitId: habit.id,
        habitTitle: habit.title,
        type: "completion",
        priority: "medium",
        title: "Increase completion",
        message: `${habit.title} is at ${completionRate}% completion over the last 7 days.`,
        action: "Try completing this habit at the same time each day.",
        id: "",
        habit: "",
        category: "streak",
        recommendation: "",
        reason: "",
        expectedImpact: "",
      });
    }
  }

  return recommendations;
}
