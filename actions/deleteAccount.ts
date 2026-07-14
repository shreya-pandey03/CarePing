"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import {
  users,
  habits,
  habitLogs,
  streaks,
  aiInsights,
  recommendations,
  weeklyReports,
  monthlyReports,
  notifications,
} from "@/drizzle/schema";
import { redis } from "@/lib/redis";

export async function deleteAccount() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  await db.transaction(async (tx) => {
    await tx.delete(habitLogs).where(eq(habitLogs.userId, userId));
    await tx.delete(streaks).where(eq(streaks.userId, userId));
    await tx.delete(aiInsights).where(eq(aiInsights.userId, userId));
    await tx.delete(recommendations).where(eq(recommendations.userId, userId));
    await tx.delete(weeklyReports).where(eq(weeklyReports.userId, userId));
    await tx.delete(monthlyReports).where(eq(monthlyReports.userId, userId));
    await tx.delete(notifications).where(eq(notifications.userId, userId));
    await tx.delete(habits).where(eq(habits.userId, userId));
    await tx.delete(users).where(eq(users.id, userId));
  });

  // Clear Redis cache
  await Promise.all([
    redis.del(`dashboard:${userId}`),
    redis.del(`habits:${userId}`),
    redis.del(`analytics:${userId}`),
    redis.del(`streaks:${userId}`),
    redis.del(`recommendations:${userId}`),
    redis.del(`reports:${userId}`),
    redis.del(`notifications:${userId}`),
  ]);

  revalidatePath("/");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Account deleted successfully.",
  };
}
