import { db } from "@/drizzle";
import { notifications } from "@/drizzle/schema";

export type NotificationCategory =
  | "habit_reminder"
  | "goal_reminder"
  | "weekly_report"
  | "monthly_report"
  | "streak_warning"
  | "motivation"
  | "achievement"
  | "recommendation";

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  actionUrl?: string;
  scheduledFor?: Date;
}

export async function createNotification(input: CreateNotificationInput) {
  return db.insert(notifications).values({
    id: crypto.randomUUID(),

    userId: input.userId,

    title: input.title,

    message: input.message,

    category: input.category,

    actionUrl: input.actionUrl ?? null,

    scheduledFor: input.scheduledFor ?? null,

    isRead: false,
  });
}

export async function createReminderNotification(
  userId: string,
  habitId: string,
  habitTitle: string,
) {
  return createNotification({
    userId,

    title: "Habit Reminder",

    message: `Don't forget to complete "${habitTitle}" today.`,

    category: "reminder",

    actionUrl: `/habits/${habitId}`,

    scheduledFor: new Date(),
  });
}

export async function createAchievementNotification(
  userId: string,
  streak: number,
) {
  return createNotification({
    userId,

    title: "Achievement Unlocked",

    message: `Congratulations! You've reached a ${streak}-day streak.`,

    category: "achievement",

    actionUrl: "/dashboard",
  });
}

export async function createWeeklyReportNotification(userId: string) {
  return createNotification({
    userId,

    title: "Weekly Report Ready",

    message: "Your personalized weekly habit report is now available.",

    category: "report",

    actionUrl: "/reports/weekly",
  });
}

export async function createRecommendationNotification(userId: string) {
  return createNotification({
    userId,

    title: "New AI Recommendations",

    message:
      "We've generated new habit recommendations based on your recent progress.",

    category: "recommendation",

    actionUrl: "/recommendations",
  });
}

export async function createSystemNotification(
  userId: string,
  title: string,
  message: string,
) {
  return createNotification({
    userId,

    title,

    message,

    category: "system",
  });
}
