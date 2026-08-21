"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";

import { goals, habits } from "@/drizzle/schema";

interface CreateGoalInput {
  title: string;
  description?: string;
  habitId: string;
  targetValue: number;
  deadline?: string;
}

export async function createGoal(input: CreateGoalInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  if (!input.title.trim()) {
    throw new Error("Goal title is required");
  }

  if (!input.habitId) {
    throw new Error("Please select a habit");
  }

  if (!Number.isFinite(input.targetValue) || input.targetValue <= 0) {
    throw new Error("Target value must be greater than 0");
  }

  // Make sure the selected habit belongs
  // to the current user.
  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, input.habitId), eq(habits.userId, userId)),
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const goal = await db
    .insert(goals)
    .values({
      id: crypto.randomUUID(),

      userId,

      habitId: input.habitId,

      title: input.title.trim(),

      description: input.description?.trim() || null,

      targetValue: input.targetValue,

      currentValue: 0,

      status: "active",

      deadline: input.deadline ? new Date(`${input.deadline}T23:59:59`) : null,
    })
    .returning();

  return goal[0];
}
