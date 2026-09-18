"use server";

import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import { generateAIRecommendations } from "./generateAIRecommendations";

export async function regenerateAIRecommendations() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const cacheKey = `ai-recommendations:${session.user.id}`;

  await redis.del(cacheKey);

  return generateAIRecommendations({
    force: true,
  });
}

