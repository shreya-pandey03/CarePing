import { desc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { aiInsights } from "@/drizzle/schema";

export async function getLatestAIRecommendations() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const result = await db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.userId, session.user.id))
    .orderBy(desc(aiInsights.generatedAt))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0];
}
