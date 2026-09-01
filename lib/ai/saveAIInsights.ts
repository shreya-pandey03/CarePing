import { auth } from "@/auth";
import { db } from "@/lib/db";
import { aiInsights } from "@/drizzle/schema";

import type { AIInsightsResult } from "./generateAIInsights";

export async function saveAIInsights(
  result: AIInsightsResult,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [saved] = await db
    .insert(aiInsights)
    .values({
      userId: session.user.id,
      summary: result.summary,
      insights: result.insights,
      recommendations: result.recommendations,
      generatedAt: new Date(),
      expiresAt: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ),
    })
    .returning();

  return saved;
}