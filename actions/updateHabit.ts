"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits } from "@/drizzle/schema";
import { emitHabitUpdated } from "@/lib/socket/emitters";

const updateHabitSchema = z.object({
  id: z.string(),

  title: z.string().min(3).max(100),

  description: z.string().optional().nullable(),

  category: z.enum([
    "custom",
    "health",
    "fitness",
    "reading",
    "learning",
    "coding",
    "career",
    "finance",
    "mindfulness",
    "nutrition",
  ]),

  frequency: z.enum(["daily", "weekly", "monthly"]),

  targetDays: z.number().min(1).max(7),

  reminderTime: z.string().optional().nullable(),

  active: z.boolean(),
});

export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;

export async function updateHabit(input: UpdateHabitInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const data = updateHabitSchema.parse(input);

  try {
    const existingHabit = await db.query.habits.findFirst({
      where: and(
        eq(habits.id, data.id),

        eq(habits.userId, session.user.id),
      ),
    });

    if (!existingHabit) {
      return {
        success: false,
        message: "Habit not found.",
      };
    }

    await db
      .update(habits)
      .set({
        title: data.title,

        description: data.description ?? null,

        category: data.category,

        frequency: data.frequency,

        targetDays: data.targetDays,

        reminderTime: data.reminderTime ?? null,

        active: data.active,

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(habits.id, data.id),

          eq(habits.userId, session.user.id),
        ),
      );
    revalidatePath("/dashboard");
    revalidatePath("/habits");
    revalidatePath(`/habits/${data.id}`);

    return {
      success: true,

      message: "Habit updated successfully.",
    };
  } catch (error) {
    console.error("Update Habit Error:", error);

    return {
      success: false,

      message: "Failed to update habit.",
    };
  }
}
