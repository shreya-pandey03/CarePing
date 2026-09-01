import { desc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { aiInsights } from "@/drizzle/schema";

export async function getAIInsightsHistory() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.userId, session.user.id))
    .orderBy(desc(aiInsights.generatedAt))
    .limit(20);
}
