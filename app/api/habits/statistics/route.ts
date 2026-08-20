import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
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

    const totalHabits = userHabits.length;

    const completedToday = logs.filter((log) => {
      const today = new Date();

      return (
        log.completedAt.toDateString() === today.toDateString()
      );
    }).length;

    const currentStreak =
      userStreaks.length > 0
        ? Math.max(
            ...userStreaks.map((streak) => streak.currentStreak),
          )
        : 0;

    return NextResponse.json({
      totalHabits,
      totalCompletions: logs.length,
      completedToday,
      currentStreak,
    });
  } catch (error) {
    console.error("HABIT STATISTICS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch habit statistics" },
      { status: 500 },
    );
  }
}