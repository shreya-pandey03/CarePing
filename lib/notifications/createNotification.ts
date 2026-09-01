import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";
import { publishRealtimeEvent } from "@/lib/realtime/publisher";
import { CHANNELS } from "@/lib/realtime/channels";

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  category:
    | "achievement"
    | "motivation"
    | "habit_reminder"
    | "goal_reminder"
    | "weekly_report"
    | "monthly_report"
    | "streak_warning"
    | "recommendation"
    | "reminder";
  actionUrl?: string;
}

export async function createNotification(
  input: CreateNotificationInput,
) {
  const notification = await db
    .insert(notifications)
    .values({
      id: crypto.randomUUID(),
      userId: input.userId,
      title: input.title,
      message: input.message,
      category: input.category,
      actionUrl: input.actionUrl ?? null,
    })
    .returning();

  const createdNotification = notification[0];

  if (!createdNotification) {
    throw new Error("Failed to create notification");
  }

  await publishRealtimeEvent(
    CHANNELS.NOTIFICATION_CREATED,
    {
      userId: input.userId,
      type: CHANNELS.NOTIFICATION_CREATED,
      payload: {
        notification: createdNotification,
      },
    },
  );

  return createdNotification;
}