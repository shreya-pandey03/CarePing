"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import {
  aiQueue,
  recommendationQueue,
  weeklyReportQueue,
  monthlyReportQueue,
} from "@/jobs/queues";
import { publishRealtimeEvent } from "@/lib/realtime/publisher";
import { CHANNELS } from "@/lib/realtime/channels";

export async function deleteHabit(habitId: string) {
  const session = await auth();

  console.log("SERVER DELETE HABIT:", habitId);

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

    
    await db.delete(habitLogs).where(eq(habitLogs.habitId, habitId));

    await db.delete(streaks).where(eq(streaks.habitId, habitId));

    await publishRealtimeEvent(CHANNELS.HABIT_DELETED, {
      userId: session.user.id,
      type: CHANNELS.HABIT_DELETED,
      payload: {
        habitId,
      },
    });

    await db
      .delete(habits)
      .where(and(eq(habits.id, habitId), eq(habits.userId, session.user.id)));

    // Queue regeneration jobs
    try {
      Promise.all([
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
