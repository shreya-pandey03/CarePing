import { NextResponse } from "next/server";

import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      userId: session.user.id,
      goals: body.goals ?? [],
      message: "Goal optimization endpoint is ready.",
    });
  } catch (error) {
    console.error("OPTIMIZE GOALS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to optimize goals" },
      { status: 500 },
    );
  }
}
