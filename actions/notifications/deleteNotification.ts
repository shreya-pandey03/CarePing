"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

export async function deleteNotification(notificationId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(notifications)
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, session.user.id),
      ),
    );

  return {
    success: true,
  };
}
