"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habitLogs, habits, streaks } from "@/drizzle/schema";
import { publishRealtimeEvent } from "@/lib/realtime/publisher";
import { CHANNELS } from "@/lib/realtime/channels";

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isYesterday(date: Date, today: Date) {
  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);

  return isSameDay(date, yesterday);
}

export async function completeHabit(habitId: string) {
  const session = await auth();

  console.log("SERVER COMPLETE HABIT:", habitId);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    const habit = await db.query.habits.findFirst({
      where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
    });

    if (!habit) {
      return {
        success: false,
        message: "Habit not found",
      };
    }

    const today = new Date();

    const existing = await db.query.habitLogs.findFirst({
      where: and(eq(habitLogs.habitId, habitId), eq(habitLogs.userId, userId)),
    });

    if (existing && isSameDay(existing.completedAt, today)) {
      return {
        success: false,
        message: "Already completed today",
      };
    }

    // 1. Create habit log

    await db.insert(habitLogs).values({
      id: crypto.randomUUID(),
      habitId,
      userId,
      completed: true,
      completedAt: today,
    });

    await publishRealtimeEvent(CHANNELS.HABIT_COMPLETED, {
      userId: session.user.id,
      type: CHANNELS.HABIT_COMPLETED,
      payload: {
        habitId,
      },
    });

    // 2. Get current streak

    const streak = await db.query.streaks.findFirst({
      where: eq(streaks.habitId, habitId),
    });

    if (!streak) {
      await db.insert(streaks).values({
        id: crypto.randomUUID(),
        habitId,
        userId,
        currentStreak: 1,
        longestStreak: 1,
        totalCompletions: 1,
        lastCompletedAt: today,
      });
    } else {
      let newCurrentStreak = streak.currentStreak;

      if (!streak.lastCompletedAt) {
        newCurrentStreak = 1;
      } else if (isYesterday(streak.lastCompletedAt, today)) {
        newCurrentStreak += 1;
      } else if (isSameDay(streak.lastCompletedAt, today)) {
        newCurrentStreak = streak.currentStreak;
      } else {
        newCurrentStreak = 1;
      }

      const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

      await db
        .update(streaks)
        .set({
          currentStreak: newCurrentStreak,

          longestStreak: newLongestStreak,

          totalCompletions: streak.totalCompletions + 1,

          lastCompletedAt: today,

          updatedAt: today,
        })
        .where(eq(streaks.habitId, habitId));
    }

    // 3. Clear dashboard cache

    const cacheKey = `dashboard:${userId}`;

    // try {
    //   await redis.del(cacheKey);
    // } catch (error) {
    //   console.error("Redis cache clear failed:", error);
    // }

    revalidatePath("/dashboard");
    revalidatePath("/habits");
    revalidatePath(`/habits/${habitId}`);

    return {
      success: true,
      message: "Habit completed",
    };
  } catch (error) {
    console.error("Complete Habit Error", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
