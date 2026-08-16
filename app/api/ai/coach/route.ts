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
      message: "Your AI coach is ready to help you build better habits.",
      response: body.message
        ? `Keep working on: ${body.message}`
        : "Keep completing your habits consistently.",
    });
  } catch (error) {
    console.error("AI COACH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to process AI coach request" },
      { status: 500 },
    );
  }
}
