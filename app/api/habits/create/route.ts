
import { db } from "@/drizzle/src";
import { habits } from "@/drizzle/src/schema";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { userId, title, description, category, frequency } = body;

  await db.insert(habits).values({
    id: nanoid(),
    userId,
    title,
    description,
    category,
    frequency,
  });

  return NextResponse.json({
    success: true,
  });
}
