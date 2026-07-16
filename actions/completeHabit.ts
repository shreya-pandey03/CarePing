"use server";

import { and, eq, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { calculateStreaks } from "@/lib/streakCalculator";
import { redis } from "@/lib/redis";
import {
  aiQueue,
  notificationQueue,
  recommendationQueue,
  streakQueue,
  weeklyReportQueue,
} from "@/jobs/queues";

const completeHabitSchema = z.object({
  habitId: z.string().uuid(),
});

export type CompleteHabitInput = z.infer<typeof completeHabitSchema>;

export async function completeHabit(input: CompleteHabitInput) {
  try {
    // Authenticate User
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Validate Input
    const { habitId } = completeHabitSchema.parse(input);

    // Verify Habit Ownership
    const habit = await db.query.habits.findFirst({
      where: and(eq(habits.id, habitId), eq(habits.userId, session.user.id)),
    });

    if (!habit) {
      return {
        success: false,
        message: "Habit not found.",
      };
    }

    // Today's Date Range
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Prevent Duplicate Completion
    const existingLog = await db.query.habitLogs.findFirst({
      where: and(
        eq(habitLogs.habitId, habitId),
        gte(habitLogs.completedAt, startOfDay),
        lte(habitLogs.completedAt, endOfDay),
      ),
    });

    if (existingLog) {
      return {
        success: false,
        message: "Habit already completed today.",
      };
    }

    // Database Transaction
    await db.transaction(async (tx) => {
      await tx.insert(habitLogs).values({
        id: crypto.randomUUID(),
        habitId,
        userId: session.user.id,
        completed: true,
        completedAt: new Date(),
      });

      const logs = await tx.query.habitLogs.findMany({
        where: eq(habitLogs.habitId, habitId),
        orderBy: (logs, { asc }) => [asc(logs.completedAt)],
      });

      const { currentStreak, longestStreak } = calculateStreaks(logs);

      const streak = await tx.query.streaks.findFirst({
        where: eq(streaks.habitId, habitId),
      });

      if (streak) {
        await tx
          .update(streaks)
          .set({
            currentStreak,
            longestStreak,
            updatedAt: new Date(),
          })
          .where(eq(streaks.habitId, habitId));
      } else {
        await tx.insert(streaks).values({
          id: crypto.randomUUID(),
          userId: session.user.id,
          habitId,
          currentStreak,
          longestStreak,
          totalCompletions: logs.length,
          lastCompletedAt: new Date(),
          riskScore: 0,
        });
      }

      await tx
        .update(habits)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(habits.id, habitId));
    });

    // Clear Redis Cache
    await Promise.all([
      redis.del(`dashboard:${session.user.id}`),
      redis.del(`analytics:${session.user.id}`),
      redis.del(`habits:${session.user.id}`),
      redis.del(`streaks:${session.user.id}`),
    ]);

    // Queue Background Jobs
    try {
      await Promise.all([
        streakQueue.add("calculate-streak", {
          userId: session.user.id,
          habitId,
        }),

        aiQueue.add("generate-ai-insights", {
          userId: session.user.id,
          habitId,
        }),

        recommendationQueue.add("generate-recommendations", {
          userId: session.user.id,
        }),

        weeklyReportQueue.add("refresh-weekly-report", {
          userId: session.user.id,
        }),

        notificationQueue.add("check-reminders", {
          userId: session.user.id,
        }),
      ]);
    } catch (queueError) {
      console.error("Queue Error:", queueError);
    }

    // Refresh Next.js Cache
    revalidatePath("/dashboard");
    revalidatePath("/habits");
    revalidatePath(`/habits/${habitId}`);
    revalidatePath("/analytics");
    revalidatePath("/streaks");

    return {
      success: true,
      message: "Habit completed successfully.",
    };
  } catch (error) {
    console.error("Complete Habit Error:", error);

    return {
      success: false,
      message: "Failed to complete habit.",
    };
  }
}
