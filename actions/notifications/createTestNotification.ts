"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

export async function createTestNotification() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    title: "🔥 Streak Update",
    message:
      "Your current habit streak is looking strong. Keep completing your habits to protect it!",
    category: "streak_warning",
    isRead: false,
    actionUrl: "/streaks",
  });

  return {
    success: true,
  };
}
