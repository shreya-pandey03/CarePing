"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

export async function getUnreadNotificationCount() {
  const session = await auth();

  if (!session?.user?.id) {
    return 0;
  }

  const result = await db
    .select({
      id: notifications.id,
    })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false),
      ),
    );

  return result.length;
}
