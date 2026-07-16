import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { nanoid } from "nanoid";
import { updateStreaks } from "@/actions/updateStreaks";
import { db } from "@/lib/db";
import { habitLogs } from "@/drizzle/schema";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { habitId } = await req.json();

  await db.insert(habitLogs).values({
    id: nanoid(),
    userId: session.user.id,
    habitId,
    completedAt: new Date(),
  });

  await updateStreaks(habitId);

  return NextResponse.json({
    success: true,
  });
}
