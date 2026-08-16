import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

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

    const correlations = userHabits.map((habit) => {
      const habitLogs = logs.filter((log) => log.habitId === habit.id);

      const streak = userStreaks.find((item) => item.habitId === habit.id);

      return {
        habit: habit.title,
        completions: habitLogs.length,
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
      };
    });

    return NextResponse.json(correlations);
  } catch (error) {
    console.error("CORRELATIONS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to calculate correlations" },
      { status: 500 },
    );
  }
}
