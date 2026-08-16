import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits } from "@/drizzle/schema";

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Habit ID is required" },
        { status: 400 },
      );
    }

    const deleted = await db
      .delete(habits)
      .where(and(eq(habits.id, body.id), eq(habits.userId, session.user.id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      habit: deleted[0],
    });
  } catch (error) {
    console.error("DELETE HABIT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 },
    );
  }
}
