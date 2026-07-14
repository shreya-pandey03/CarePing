"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import {
  aiQueue,
  recommendationQueue,
  weeklyReportQueue,
  monthlyReportQueue,
} from "@/jobs/queues";

export async function deleteHabit(habitId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const habit = await db.query.habits.findFirst({
      where: and(eq(habits.id, habitId), eq(habits.userId, session.user.id)),
    });

    if (!habit) {
      return {
        success: false,
        message: "Habit not found.",
      };
    }

    await db.transaction(async (tx) => {
      // Delete all logs
      await tx.delete(habitLogs).where(eq(habitLogs.habitId, habitId));

      // Delete streak
      await tx.delete(streaks).where(eq(streaks.habitId, habitId));

      // Delete habit
      await tx.delete(habits).where(eq(habits.id, habitId));
    });

    // Queue regeneration jobs
    try {
      await Promise.all([
        aiQueue.add("generate-ai-insights", {
          userId: session.user.id,
        }),

        recommendationQueue.add("generate-recommendations", {
          userId: session.user.id,
        }),

        weeklyReportQueue.add("refresh-weekly-report", {
          userId: session.user.id,
        }),

        monthlyReportQueue.add("refresh-monthly-report", {
          userId: session.user.id,
        }),
      ]);
    } catch (queueError) {
      console.error("Queue Error:", queueError);
    }

    revalidatePath("/dashboard");
    revalidatePath("/habits");
    revalidatePath("/analytics");
    revalidatePath("/reports");
    revalidatePath("/recommendations");
    revalidatePath("/insights");

    return {
      success: true,
      message: "Habit deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Habit Error:", error);

    return {
      success: false,
      message: "Failed to delete habit.",
    };
  }
}
