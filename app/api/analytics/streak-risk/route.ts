import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { predictStreakRisk } from "@/lib/analytics/streak-prediction";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [userHabits, logs, userStreaks] = await Promise.all([
      db.query.habits.findMany({
        where: eq(habits.userId, userId),
      }),

      db.query.habitLogs.findMany({
        where: eq(habitLogs.userId, userId),
      }),

      db.query.streaks.findMany({
        where: eq(streaks.userId, userId),
      }),
    ]);

    const predictions = userHabits.map((habit) => {
      const streak = userStreaks.find((item) => item.habitId === habit.id);

      return {
        ...predictStreakRisk(habit, logs, streak),
        title: habit.title,
      };
    });

    return NextResponse.json(predictions);
  } catch (error) {
    console.error("STREAK RISK ERROR:", error);

    return NextResponse.json(
      { error: "Failed to calculate streak risk" },
      { status: 500 },
    );
  }
}
