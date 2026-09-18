"use server";

import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import {
  generateAIRecommendations,
  type AIRecommendationsResult,
} from "./generateAIRecommendations";

export async function getAIRecommendations(): Promise<AIRecommendationsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const cacheKey = `ai-recommendations:${session.user.id}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    try {
      return JSON.parse(cached) as AIRecommendationsResult;
    } catch {
      await redis.del(cacheKey);
    }
  }

  return generateAIRecommendations();
}
