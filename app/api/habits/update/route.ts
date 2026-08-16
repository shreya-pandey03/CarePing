import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits } from "@/drizzle/schema";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      id,
      title,
      description,
      category,
      frequency,
      targetDays,
      color,
      icon,
      reminderTime,
      active,
      archived,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Habit ID is required" },
        { status: 400 },
      );
    }

    const existingHabit = await db.query.habits.findFirst({
      where: eq(habits.id, id),
    });

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (existingHabit.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [updatedHabit] = await db
      .update(habits)
      .set({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(frequency !== undefined && { frequency }),
        ...(targetDays !== undefined && { targetDays }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(reminderTime !== undefined && { reminderTime }),
        ...(active !== undefined && { active }),
        ...(archived !== undefined && { archived }),
        updatedAt: new Date(),
      })
      .where(eq(habits.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      habit: updatedHabit,
    });
  } catch (error) {
    console.error("UPDATE HABIT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update habit",
      },
      { status: 500 },
    );
  }
}
