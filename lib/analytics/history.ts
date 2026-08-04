import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

import { calculateCompletionRate, calculateConsistency } from "@/lib/analytics";

export async function getCompletionHistory(userId: string) {
  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const totalHabits = userHabits.length;
  const completedHabits = logs.length;

  const completionRate = calculateCompletionRate(
    completedHabits,
    Math.max(totalHabits, 1),
  );

  const consistency = calculateConsistency(
    userStreaks.map((s) => s.currentStreak),
  );

  return {
    completionData: [
      {
        date: "Overall",
        completionRate,
      },
    ],

    consistencyData: [
      {
        label: "Consistency",
        consistency,
      },
    ],

    streakData: userStreaks.map((streak) => ({
      date: streak.updatedAt.toLocaleDateString(),
      streak: streak.currentStreak,
    })),

    heatmapData: (() => {
      const map = new Map<string, number>();

      logs.forEach((log) => {
        const date = log.completedAt.toISOString().split("T")[0];

        map.set(date, (map.get(date) ?? 0) + 1);
      });

      return Array.from(map.entries()).map(([date, count]) => ({
        date,
        completionRate: Math.min(
          Math.round((count / Math.max(totalHabits, 1)) * 100),
          100,
        ),
      }));
    })(),

    correlationData: userHabits.map((habit) => {
      const streak = userStreaks.find((s) => s.habitId === habit.id);

      return {
        habit: habit.title,
        completionRate,
        consistency,
        streak: streak?.currentStreak ?? 0,
      };
    }),
  };
}
