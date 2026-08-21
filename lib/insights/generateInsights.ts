import type { InferSelectModel } from "drizzle-orm";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

type Habit = InferSelectModel<typeof habits>;
type HabitLog = InferSelectModel<typeof habitLogs>;
type Streak = InferSelectModel<typeof streaks>;

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  streaks: Streak[];
}

export function generateInsights({ habits, logs, streaks }: Props): string[] {
  const insights: string[] = [];

  if (habits.length === 0) {
    return [
      "Create your first habit to begin receiving personalized insights.",
    ];
  }

  const habitStats = habits.map((habit) => {
    const streak = streaks.find((s) => s.habitId === habit.id);

    return {
      habit,
      streak: streak?.currentStreak ?? 0,
      longest: streak?.longestStreak ?? 0,
    };
  });

  const sorted = [...habitStats].sort((a, b) => b.streak - a.streak);

  const strongest = sorted[0];

  const weakest = [...habitStats].sort((a, b) => a.streak - b.streak)[0];

  if (strongest) {
    insights.push(
      `"${strongest.habit.title.trim()}" is your strongest habit with a ${strongest.streak}-day streak.`,
    );
  }

  if (
    weakest &&
    weakest.habit.id !== strongest?.habit.id &&
    weakest.streak < strongest.streak
  ) {
    insights.push(
      `"${weakest.habit.title.trim()}" needs more consistency. Current streak is only ${weakest.streak} days.`,
    );
  }

  const today = new Date().toDateString();

  const completedToday = new Set(
    logs
      .filter(
        (log) => log.completed && log.completedAt.toDateString() === today,
      )
      .map((log) => log.habitId),
  ).size;

  if (completedToday === habits.length) {
    insights.push("Excellent! You completed every habit today.");
  } else if (completedToday === 0) {
    insights.push(
      "You haven't completed any habits today. Start with one small win.",
    );
  } else {
    insights.push(
      `You've completed ${completedToday} of ${habits.length} habits today.`,
    );
  }

  const avg =
    streaks.length > 0
      ? streaks.reduce((sum, s) => sum + s.currentStreak, 0) / streaks.length
      : 0;

  if (avg >= 10) {
    insights.push("You're building excellent long-term consistency.");
  } else if (avg >= 5) {
    insights.push("You're making steady progress. Keep your streaks alive.");
  } else {
    insights.push("Small daily actions will build stronger streaks over time.");
  }

  return insights;
}
