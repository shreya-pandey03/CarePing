
import { db } from "@/drizzle";
import { habits } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  const data = await db.query.habits.findMany({
    where: eq(habits.userId, userId!),
  });

  return NextResponse.json(data);
}