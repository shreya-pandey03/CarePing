"use server";

import { revalidatePath } from "next/cache";
import { and, eq, gte, lt } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";

import {
  habitLogs,
  habits,
  streaks,
  goals,
  notifications,
} from "@/drizzle/schema";

import { publishRealtimeEvent } from "@/lib/realtime/publisher";
import { CHANNELS } from "@/lib/realtime/channels";
import { analyticsQueue } from "@/jobs/queues/analytics.queue";
import { redis } from "@/lib/redis";

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
    /*
     * --------------------------------------------------
     * 1. Verify habit belongs to current user
     * --------------------------------------------------
     */

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

    /*
     * --------------------------------------------------
     * 2. Check if habit is already completed today
     * --------------------------------------------------
     */

    const startOfDay = new Date(today);

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);

    endOfDay.setHours(23, 59, 59, 999);

    const existing = await db.query.habitLogs.findFirst({
      where: and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.userId, userId),
        eq(habitLogs.completed, true),
        gte(habitLogs.completedAt, startOfDay),
        lt(habitLogs.completedAt, endOfDay),
      ),
    });

    if (existing) {
      return {
        success: false,
        message: "Already completed today",
      };
    }

    /*
     * --------------------------------------------------
     * 3. Create habit completion log
     * --------------------------------------------------
     */

    await db.insert(habitLogs).values({
      id: crypto.randomUUID(),
      habitId,
      userId,
      completed: true,
      completedAt: today,
    });

    /*
     * --------------------------------------------------
     * 4. Publish realtime event
     * --------------------------------------------------
     */

    await publishRealtimeEvent(CHANNELS.HABIT_COMPLETED, {
      userId,
      type: CHANNELS.HABIT_COMPLETED,
      payload: {
        habitId,
      },
    });

    /*
     * --------------------------------------------------
     * 5. Update streak
     * --------------------------------------------------
     */

    const streak = await db.query.streaks.findFirst({
      where: and(eq(streaks.habitId, habitId), eq(streaks.userId, userId)),
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
        .where(and(eq(streaks.habitId, habitId), eq(streaks.userId, userId)));
    }

    /*
     * --------------------------------------------------
     * 6. Update goal belonging to THIS habit
     * --------------------------------------------------
     */

    const activeGoal = await db.query.goals.findFirst({
      where: and(
        eq(goals.userId, userId),
        eq(goals.habitId, habitId),
        eq(goals.status, "active"),
      ),
    });

    if (activeGoal) {
      /*
       * Count actual completed logs instead of simply
       * incrementing currentValue.
       *
       * This keeps the goal synchronized with habit logs.
       */

      const completedLogs = await db.query.habitLogs.findMany({
        where: and(
          eq(habitLogs.userId, userId),
          eq(habitLogs.habitId, habitId),
          eq(habitLogs.completed, true),
        ),
      });

      const currentValue = completedLogs.length;

      const goalCompleted = currentValue >= activeGoal.targetValue;

      await db
        .update(goals)
        .set({
          currentValue: Math.min(currentValue, activeGoal.targetValue),

          status: goalCompleted ? "completed" : "active",

          updatedAt: today,
        })
        .where(and(eq(goals.id, activeGoal.id), eq(goals.userId, userId)));

      /*
       * Create notification only when goal
       * becomes completed.
       */

      if (goalCompleted) {
        await db.insert(notifications).values({
          id: crypto.randomUUID(),

          userId,

          title: "Goal Completed 🎉",

          message: `Congratulations! You completed your goal "${activeGoal.title}".`,

          category: "achievement",

          actionUrl: "/goals",

          createdAt: today,
        });
      }
    }

    /*
     * --------------------------------------------------
     * 7. Clear AI report cache
     * --------------------------------------------------
     */

    const aiReportCacheKey = `ai:report:${userId}`;

    try {
      await redis.del(aiReportCacheKey);
    } catch (error) {
      console.error("Failed to clear AI cache:", error);
    }

    /*
     * --------------------------------------------------
     * 8. Update analytics queue
     * --------------------------------------------------
     */

    await analyticsQueue.add("update-analytics", {
      userId,
      habitId,
    });

    /*
     * --------------------------------------------------
     * 9. Revalidate pages
     * --------------------------------------------------
     */

    revalidatePath("/dashboard");

    revalidatePath("/habits");

    revalidatePath(`/habits/${habitId}`);

    revalidatePath("/analytics");

    revalidatePath("/insights");

    revalidatePath("/recommendations");

    revalidatePath("/goals");

    revalidatePath("/notifications");

    revalidatePath("/streaks");

    /*
     * --------------------------------------------------
     * 10. Return success
     * --------------------------------------------------
     */

    return {
      success: true,
      message: "Habit completed",
    };
  } catch (error) {
    console.error("Complete Habit Error:", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
