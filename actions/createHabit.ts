"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { habits } from "@/drizzle/schema";

const createHabitSchema = z.object({
  title: z.string().min(3).max(100),

  description: z.string().optional(),

  category: z.string().min(1),

  frequency: z.enum(["daily", "weekly", "monthly"]),

  targetDays: z.number().min(1).max(7),

  reminderTime: z.string().optional(),

  active: z.boolean(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;

export async function createHabit(input: CreateHabitInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const data = createHabitSchema.parse(input);

  try {
    await db.insert(habits).values({
      userId: session.user.id,

      title: data.title,

      description: data.description ?? null,

      category: data.category,

      frequency: data.frequency,

      targetDays: data.targetDays,

      reminderTime: data.reminderTime || null,

      active: data.active,
    });

    revalidatePath("/dashboard");
    revalidatePath("/habits");

    return {
      success: true,
      message: "Habit created successfully.",
    };
  } catch (error) {
    console.error("Create Habit Error:", error);

    return {
      success: false,
      message: "Failed to create habit.",
    };
  }
}
