import { and, desc, eq, gt } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { aiInsights } from "@/drizzle/schema";

export async function getLatestAIInsights() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [result] = await db
    .select()
    .from(aiInsights)
    .where(
      and(
        eq(aiInsights.userId, session.user.id),
        gt(aiInsights.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(aiInsights.generatedAt))
    .limit(1);

  return result ?? null;
}


