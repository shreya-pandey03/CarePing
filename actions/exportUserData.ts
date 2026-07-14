"use server";

import { eq } from "drizzle-orm";

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

export async function exportUserData() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const [
    user,
    userHabits,
    logs,
    userStreaks,
    userInsights,
    userRecommendations,
    weekly,
    monthly,
    userNotifications,
  ] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, userId),
    }),

    db.query.habits.findMany({
      where: eq(habits.userId, userId),
    }),

    db.query.habitLogs.findMany({
      where: eq(habitLogs.userId, userId),
    }),

    db.query.streaks.findMany({
      where: eq(streaks.userId, userId),
    }),

    db.query.aiInsights.findMany({
      where: eq(aiInsights.userId, userId),
    }),

    db.query.recommendations.findMany({
      where: eq(recommendations.userId, userId),
    }),

    db.query.weeklyReports.findMany({
      where: eq(weeklyReports.userId, userId),
    }),

    db.query.monthlyReports.findMany({
      where: eq(monthlyReports.userId, userId),
    }),

    db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
    }),
  ]);

  return {
    exportedAt: new Date().toISOString(),

    user,

    habits: userHabits,

    habitLogs: logs,

    streaks: userStreaks,

    insights: userInsights,

    recommendations: userRecommendations,

    weeklyReports: weekly,

    monthlyReports: monthly,

    notifications: userNotifications,
  };
}
