import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getMonthlyAnalytics } from "@/lib/analytics/monthly";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getMonthlyAnalytics(session.user.id);

    return NextResponse.json(data);
  } catch (error) {
    console.error("MONTHLY ANALYTICS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch monthly analytics" },
      { status: 500 },
    );
  }
}
