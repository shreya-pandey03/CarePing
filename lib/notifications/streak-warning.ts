import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { streaks, habits } from "@/drizzle/schema";

export async function createStreakWarningNotifications(userId: string) {
  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  for (const streak of userStreaks) {
    if (streak.currentStreak <= 0) {
      continue;
    }

    if (!streak.lastCompletedAt) {
      continue;
    }

    const lastCompleted = new Date(streak.lastCompletedAt);
    const now = new Date();

    const diffMs = now.getTime() - lastCompleted.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Warn when more than 20 hours have passed
    if (diffHours < 20) {
      continue;
    }

    const habit = await db.query.habits.findFirst({
      where: and(eq(habits.id, streak.habitId), eq(habits.userId, userId)),
    });

    if (!habit) {
      continue;
    }

    await db.insert(notifications).values({
      id: crypto.randomUUID(),
      userId,
      title: " Your streak is at risk",
      message: `Complete "${habit.title}" today to protect your ${streak.currentStreak}-day streak.`,
      category: "streak_warning",
      actionUrl: `/habits/${habit.id}`,
    });
  }
}
