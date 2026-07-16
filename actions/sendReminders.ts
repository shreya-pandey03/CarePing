"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { habits, habitLogs, notifications } from "@/drizzle/schema";

interface ReminderResult {
  success: boolean;
  remindersSent: number;
}

const CACHE_TTL = 60 * 60 * 24;

export async function sendReminder(): Promise<ReminderResult> {
  const now = new Date();

  const currentTime = now.toTimeString().slice(0, 5);

  const reminderHabits = await db.query.habits.findMany({
    where: and(eq(habits.active, true), eq(habits.reminderTime, currentTime)),
  });

  let remindersSent = 0;

  for (const habit of reminderHabits) {
    const today = now.toISOString().split("T")[0];

    const cacheKey = `reminder:${habit.userId}:${habit.id}:${today}`;

    const alreadySent = await redis.get(cacheKey);

    if (alreadySent) {
      continue;
    }

    const todayLog = await db.query.habitLogs.findFirst({
      where: and(
        eq(habitLogs.userId, habit.userId),

        eq(habitLogs.habitId, habit.id),
      ),

      orderBy: (logs, { desc }) => [desc(logs.completedAt)],
    });

    if (
      todayLog &&
      todayLog.completedAt.toDateString() === now.toDateString()
    ) {
      continue;
    }

    await db.insert(notifications).values({
      id: crypto.randomUUID(),
      userId: habit.userId,
      title: "Habit Reminder",
      message: `Don't forget to complete "${habit.title}" today.`,
      category: "habit_reminder",
      isRead: false,
      actionUrl: `/habits/${habit.id}`,
      createdAt: now,
    });

    remindersSent++;

    await redis.set(cacheKey, "sent", "EX", CACHE_TTL);
  }

  return {
    success: true,
    remindersSent,
  };
}
