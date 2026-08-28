import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";
import { publishRealtimeEvent } from "@/lib/realtime/publisher";
import { CHANNELS } from "@/lib/realtime/channels";

type NotificationCategory =
  | "achievement"
  | "motivation"
  | "habit_reminder"
  | "goal_reminder"
  | "weekly_report"
  | "monthly_report"
  | "streak_warning"
  | "recommendation"
  | "reminder";

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  actionUrl?: string | null;
}

export async function createNotification(
  input: CreateNotificationInput,
) {
  const result = await db
    .insert(notifications)
    .values({
      id: crypto.randomUUID(),
      userId: input.userId,
      title: input.title,
      message: input.message,
      category: input.category,
      isRead: false,
      actionUrl: input.actionUrl ?? null,
    })
    .returning();

  const notification = result[0];

  if (!notification) {
    throw new Error("Failed to create notification");
  }

  await publishRealtimeEvent(
    CHANNELS.NOTIFICATION_CREATED,
    {
      userId: input.userId,
      type: CHANNELS.NOTIFICATION_CREATED,
      payload: {
        notification,
      },
    },
  );

  return notification;
}