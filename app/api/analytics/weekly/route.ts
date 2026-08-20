import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getWeeklyAnalytics } from "@/lib/analytics/weekly";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analytics = await getWeeklyAnalytics(session.user.id);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Weekly analytics error:", error);

    return NextResponse.json(
      { error: "Failed to fetch weekly analytics" },
      { status: 500 },
    );
  }
}
