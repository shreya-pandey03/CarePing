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
      message: "Weekly report endpoint is ready.",
      userId: session.user.id,
    });
  } catch (error) {
    console.error("WEEKLY REPORT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate weekly report" },
      { status: 500 },
    );
  }
}
