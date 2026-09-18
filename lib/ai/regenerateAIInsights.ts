"use server";

import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import { generateAIInsights } from "./generateAIInsights";

export async function regenerateAIInsights() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const cacheKey = `ai-insights:${userId}`;

  await redis.del(cacheKey);

  return generateAIInsights();
}

