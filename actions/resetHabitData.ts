"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/drizzle";

import {
  habitLogs,
  streaks,
  aiInsights,
  recommendations,
  weeklyReports,
  monthlyReports,
  notifications,
} from "@/drizzle/schema";

import { redis } from "@/lib/redis";

import { aiQueue, recommendationQueue, weeklyReportQueue } from "@/jobs/queues";

export async function resetHabitData() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  await db.transaction(async (tx) => {
    // Delete all completion logs
    await tx.delete(habitLogs).where(eq(habitLogs.userId, userId));

    // Reset every streak
    await tx
      .update(streaks)
      .set({
        currentStreak: 0,
        longestStreak: 0,
        updatedAt: new Date(),
      })
      .where(eq(streaks.userId, userId));

    // Remove AI generated data
    await tx.delete(aiInsights).where(eq(aiInsights.userId, userId));

    await tx.delete(recommendations).where(eq(recommendations.userId, userId));

    await tx.delete(weeklyReports).where(eq(weeklyReports.userId, userId));

    await tx.delete(monthlyReports).where(eq(monthlyReports.userId, userId));

    await tx.delete(notifications).where(eq(notifications.userId, userId));
  });

  // Clear Redis cache
  await Promise.all([
    redis.del(`dashboard:${userId}`),
    redis.del(`analytics:${userId}`),
    redis.del(`habits:${userId}`),
    redis.del(`streaks:${userId}`),
    redis.del(`recommendations:${userId}`),
    redis.del(`reports:${userId}`),
    redis.del(`notifications:${userId}`),
  ]);

  // Queue regeneration of AI data
  await Promise.all([
    aiQueue.add("generate-ai-insights", {
      userId,
    }),

    recommendationQueue.add("generate-recommendations", {
      userId,
    }),

    weeklyReportQueue.add("refresh-weekly-report", {
      userId,
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  revalidatePath("/analytics");
  revalidatePath("/ai");
  revalidatePath("/reports");
  revalidatePath("/recommendations");
  revalidatePath("/notifications");

  return {
    success: true,
    message: "Habit data reset successfully.",
  };
}
