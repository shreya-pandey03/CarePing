"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";

import { buildAIContext } from "@/lib/ai/context";
import { generateAIReport } from "@/lib/ai/gemini";
import { getCachedAIReport } from "@/lib/ai/report";

export async function getCoachReport() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [userHabits, logs, userStreaks] = await Promise.all([
    db.query.habits.findMany({
      where: eq(habits.userId, userId),
    }),
    db.query.habitLogs.findMany({
      where: eq(habitLogs.userId, userId),
    }),
    db.query.streaks.findMany({
      where: eq(streaks.userId, userId),
    }),
  ]);

  const context = buildAIContext(userHabits, logs, userStreaks);

 return getCachedAIReport(
  userId,
  context,
);
}
