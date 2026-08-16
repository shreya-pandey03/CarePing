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
      message:
        "Small actions repeated every day create extraordinary results. Keep going!",
    });
  } catch (error) {
    console.error("MOTIVATION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate motivation" },
      { status: 500 },
    );
  }
}
