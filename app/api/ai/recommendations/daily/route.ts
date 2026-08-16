import { NextResponse } from "next/server";

import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      userId: session.user.id,
      recommendations: [],
    });
  } catch (error) {
    console.error("DAILY RECOMMENDATIONS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch daily recommendations" },
      { status: 500 },
    );
  }
}
