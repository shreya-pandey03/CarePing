"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

export async function markAllNotificationsAsRead() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(notifications)
    .set({
      isRead: true,
    })
    .where(
      and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false),
      ),
    );

  return {
    success: true,
  };
}
