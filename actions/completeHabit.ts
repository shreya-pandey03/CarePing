"use server";

import { revalidatePath } from "next/cache";
import { and, eq, gte, lt } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habitLogs, habits, streaks, goals } from "@/drizzle/schema";
import { publishRealtimeEvent } from "@/lib/realtime/publisher";
import { CHANNELS } from "@/lib/realtime/channels";
import { analyticsQueue } from "@/jobs/queues/analytics.queue";
import { redis } from "@/lib/redis";
import { checkAchievements } from "@/lib/achievements/checkAchievements";
import { createNotification } from "@/lib/notifications/createNotification";

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

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await db.query.habitLogs.findFirst({
      where: and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.userId, userId),
        gte(habitLogs.completedAt, startOfDay),
        lt(habitLogs.completedAt, endOfDay),
      ),
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
      userId,
      type: CHANNELS.HABIT_COMPLETED,
      payload: {
        habitId,
      },
    });

    // 2. Update streak
    const streak = await db.query.streaks.findFirst({
      where: and(eq(streaks.habitId, habitId), eq(streaks.userId, userId)),
    });

    let finalCurrentStreak = 1;
    let finalLongestStreak = 1;

    if (!streak) {
      await db.insert(streaks).values({
        id: crypto.randomUUID(),
        habitId,
        userId,
        currentStreak: 1,
        longestStreak: 1,
        totalCompletions: 1,
        lastCompletedAt: today,
        updatedAt: today,
      });
    } else {
      let newCurrentStreak = 1;

      if (streak.lastCompletedAt) {
        if (isSameDay(streak.lastCompletedAt, today)) {
          return {
            success: false,
            message: "Already completed today",
          };
        }

        if (isYesterday(streak.lastCompletedAt, today)) {
          newCurrentStreak = streak.currentStreak + 1;
        }
      }

      const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

      finalCurrentStreak = newCurrentStreak;
      finalLongestStreak = newLongestStreak;

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

    // 3. Check achievements

    const unlockedBadges = await checkAchievements({
      userId,
      currentStreak: finalCurrentStreak,
      longestStreak: finalLongestStreak,
    });

    // 4. Create achievement notifications

    for (const badge of unlockedBadges) {
      await createNotification({
        userId,
        title: "🏆 Achievement Unlocked!",
        message: `You earned the "${badge.name}" badge.`,
        category: "achievement",
        actionUrl: "/achievements",
      });
    }

    // 5. Update active goal

    const activeGoal = await db.query.goals.findFirst({
      where: and(eq(goals.userId, userId), eq(goals.status, "active")),
    });

    if (activeGoal) {
      const newCurrentValue = activeGoal.currentValue + 1;

      const goalCompleted = newCurrentValue >= activeGoal.targetValue;

      await db
        .update(goals)
        .set({
          currentValue: Math.min(newCurrentValue, activeGoal.targetValue),
          status: goalCompleted ? "completed" : "active",
          updatedAt: today,
        })
        .where(eq(goals.id, activeGoal.id));

      if (goalCompleted) {
        await createNotification({
          userId,
          title: " Goal Completed!",
          message: `Congratulations! You completed your goal "${activeGoal.title}".`,
          category: "achievement",
          actionUrl: "/goals",
        });
      }
    }

    // 6. Clear AI insights cache

    const aiInsightsCacheKey = `ai-insights:${userId}`;

    try {
      await redis.del(aiInsightsCacheKey);
    } catch (error) {
      console.error("Failed to clear AI insights cache:", error);
    }

    // 7. Analytics job

    await analyticsQueue.add("update-analytics", {
      userId,
      habitId,
    });

    // 8. Revalidate pages

    revalidatePath("/dashboard");
    revalidatePath("/habits");
    revalidatePath(`/habits/${habitId}`);
    revalidatePath("/goals");
    revalidatePath("/notifications");
    revalidatePath("/achievements");

    return {
      success: true,
      message: "Habit completed",
      unlockedBadges: unlockedBadges.map((badge) => badge.name),
    };
  } catch (error) {
    console.error("Complete Habit Error", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
