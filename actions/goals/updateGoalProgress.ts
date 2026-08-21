"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { goals } from "@/drizzle/schema";

export async function updateGoalProgress(goalId: string, value: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Invalid progress value.");
  }

  const goal = await db.query.goals.findFirst({
    where: and(eq(goals.id, goalId), eq(goals.userId, session.user.id)),
  });

  if (!goal) {
    throw new Error("Goal not found.");
  }

  const newValue = Math.min(value, goal.targetValue);

  const status = newValue >= goal.targetValue ? "completed" : "active";

  await db
    .update(goals)
    .set({
      currentValue: newValue,
      status,
      updatedAt: new Date(),
    })
    .where(and(eq(goals.id, goalId), eq(goals.userId, session.user.id)));

  return {
    currentValue: newValue,
    status,
  };
}
