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
    insights.push(
      "Create your first habit to begin receiving personalized insights.",
    );

    return insights;
  }

  const bestStreak = [...streaks].sort(
    (a, b) => b.currentStreak - a.currentStreak,
  )[0];

  if (bestStreak) {
    const habit = habits.find((h) => h.id === bestStreak.habitId);

    if (habit) {
      insights.push(
        ` "${habit.title}" is your strongest habit with a ${bestStreak.currentStreak}-day streak.`,
      );
    }
  }

  const weakest = [...streaks].sort(
    (a, b) => a.currentStreak - b.currentStreak,
  )[0];

  if (weakest) {
    const habit = habits.find((h) => h.id === weakest.habitId);

    if (habit) {
      insights.push(
        ` "${habit.title}" needs more consistency. Current streak is only ${weakest.currentStreak} days.`,
      );
    }
  }

  const completedToday = logs.filter((log) => {
    const today = new Date().toDateString();

    return log.completedAt.toDateString() === today;
  }).length;

  if (completedToday === habits.length) {
    insights.push(" Excellent! You completed every habit today.");
  } else if (completedToday === 0) {
    insights.push(
      " You haven't completed any habits today. Start with one small win.",
    );
  } else {
    insights.push(
      ` You've completed ${completedToday} of ${habits.length} habits today.`,
    );
  }

  const avg =
    streaks.reduce((sum, s) => sum + s.currentStreak, 0) /
    Math.max(streaks.length, 1);

  if (avg >= 10) {
    insights.push(" You're building excellent long-term consistency.");
  } else if (avg >= 5) {
    insights.push(" You're making steady progress. Keep your streaks alive.");
  } else {
    insights.push(
      " Small daily actions will build stronger streaks over time.",
    );
  }
  return insights;
}