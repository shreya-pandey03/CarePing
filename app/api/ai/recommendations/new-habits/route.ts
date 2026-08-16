import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userHabits = await db.query.habits.findMany({
      where: eq(habits.userId, session.user.id),
    });

    const categories = new Set(userHabits.map((habit) => habit.category));

    const suggestions = [
      {
        title: "Daily Exercise",
        category: "fitness",
        reason: "Improves physical activity and consistency.",
      },
      {
        title: "Read for 20 Minutes",
        category: "reading",
        reason: "Helps build a daily learning routine.",
      },
      {
        title: "Practice Coding",
        category: "coding",
        reason: "Builds technical skills through repetition.",
      },
      {
        title: "Meditate",
        category: "mindfulness",
        reason: "Can help establish a consistent mindfulness routine.",
      },
      {
        title: "Track Expenses",
        category: "finance",
        reason: "Helps develop better financial awareness.",
      },
    ].filter((item) => !categories.has(item.category as never));

    return NextResponse.json({
      suggestions,
    });
  } catch (error) {
    console.error("New habit recommendations error:", error);

    return NextResponse.json(
      { error: "Failed to generate new habit suggestions" },
      { status: 500 },
    );
  }
}
