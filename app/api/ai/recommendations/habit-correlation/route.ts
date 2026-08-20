import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [userHabits, logs] = await Promise.all([
      db.query.habits.findMany({
        where: eq(habits.userId, userId),
      }),

      db.query.habitLogs.findMany({
        where: eq(habitLogs.userId, userId),
      }),
    ]);

    const correlations = userHabits.map((habit) => {
      const habitLogs = logs.filter((log) => log.habitId === habit.id);

      return {
        habitId: habit.id,
        habit: habit.title,
        category: habit.category,
        completions: habitLogs.length,
      };
    });

    return NextResponse.json({
      correlations,
    });
  } catch (error) {
    console.error("Habit correlation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate habit correlations" },
      { status: 500 },
    );
  }
}
