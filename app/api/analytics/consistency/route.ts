import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { streaks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { calculateConsistency } from "@/lib/analytics";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userStreaks = await db.query.streaks.findMany({
      where: eq(streaks.userId, session.user.id),
    });

    const consistency = calculateConsistency(
      userStreaks.map((streak) => streak.currentStreak),
    );

    return NextResponse.json({
      consistency,
      streaks: userStreaks.map((streak) => ({
        habitId: streak.habitId,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
      })),
    });
  } catch (error) {
    console.error("Consistency analytics error:", error);
    return NextResponse.json(
      { error: "Failed to calculate consistency" },
      { status: 500 },
    );
  }
}
