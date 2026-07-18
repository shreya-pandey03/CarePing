"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/lib/db";

import { habitLogs, habits } from "@/drizzle/schema";


import { redis } from "@/lib/redis";
import { emitHabitCompleted } from "@/lib/socket/emitters";

export async function completeHabit(habitId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    const habit = await db.query.habits.findFirst({
      where: and(
        eq(habits.id, habitId),

        eq(habits.userId, userId),
      ),
    });

    if (!habit) {
      return {
        success: false,

        message: "Habit not found",
      };
    }

    const today = new Date();

    const existing = await db.query.habitLogs.findFirst({
      where: and(
        eq(habitLogs.habitId, habitId),

        eq(habitLogs.userId, userId),
      ),
    });

    if (existing) {
      return {
        success: false,

        message: "Already completed today",
      };
    }

    await db.insert(habitLogs).values({
      id: crypto.randomUUID(),

      habitId,

      userId,

      completedAt: today,
    });

    /*
          Redis cache update
        */

    const cacheKey = `dashboard:${userId}`;

    await redis.del(cacheKey);

    /*
          Socket realtime event
        */

    emitHabitCompleted(
      userId,

      {
        habitId,

        completedAt: today.toISOString(),
      },
    );

    revalidatePath("/dashboard");

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
