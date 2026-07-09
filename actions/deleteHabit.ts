"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/drizzle";

import {
  habits,
  habitLogs,
  streaks,
  weeklyReports,
  monthlyReports,
  insights,
  recommendations,
  notifications,
} from "@/drizzle/schema";

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
      await tx.delete(habitLogs).where(eq(habitLogs.habitId, habitId));

      await tx.delete(streaks).where(eq(streaks.habitId, habitId));

      await tx.delete(weeklyReports).where(eq(weeklyReports.habitId, habitId));

      await tx
        .delete(monthlyReports)
        .where(eq(monthlyReports.habitId, habitId));

      await tx.delete(insights).where(eq(insights.habitId, habitId));

      await tx
        .delete(recommendations)
        .where(eq(recommendations.habitId, habitId));

      await tx.delete(notifications).where(eq(notifications.habitId, habitId));

      await tx.delete(habits).where(eq(habits.id, habitId));
    });

    revalidatePath("/dashboard");
    revalidatePath("/habits");

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
