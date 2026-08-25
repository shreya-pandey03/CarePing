"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

export async function markAllNotificationsRead() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(notifications)
    .set({
      isRead: true,
    })
    .where(eq(notifications.userId, session.user.id));

  revalidatePath("/notifications");

  return {
    success: true,
  };
}
