import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { generateInsights } from "@/lib/insights/generateInsights";

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

    const insights = generateInsights({
      habits: userHabits,
      logs,
      streaks: userStreaks,
    });

    return NextResponse.json({
      insights,
    });
  } catch (error) {
    console.error("AI insights error:", error);

    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 },
    );
  }
}
