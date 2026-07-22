"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, streaks } from "@/drizzle/schema";

const createHabitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
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
  targetDays: z.number().min(1),
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
    const habitId = crypto.randomUUID();

    await db.insert(habits).values({
      id: habitId,
      userId: session.user.id,
      title: data.title,
      description: data.description ?? null,
      category: data.category,
      frequency: data.frequency,
      targetDays: data.targetDays,
      reminderTime: data.reminderTime ?? null,
      active: data.active,
    });


    await db.insert(streaks).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      habitId,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      lastCompletedAt: null,
    });

    revalidatePath("/dashboard");
    revalidatePath("/habits");

    return {
      success: true,
      message: "Habit created successfully.",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Create Habit Error:", error.message, error.stack);
    } else {
      console.error("Create Habit Error:", error);

      if (error instanceof Error) {
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
      }
    }

    return {
      success: false,
      message: "Failed to create habit.",
    };
  }
}
