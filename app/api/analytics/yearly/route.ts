import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getYearlyAnalytics } from "@/lib/analytics/yearly";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const data = await getYearlyAnalytics(session.user.id);

    return NextResponse.json(data);
  } catch (error) {
    console.error("YEARLY ANALYTICS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch yearly analytics" },
      { status: 500 },
    );
  }
}