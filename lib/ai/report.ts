import { redis } from "@/lib/redis";

import { generateAIReport } from "./gemini";
import type { AIContext } from "./context";
import type { AICoachResponse } from "./types";

const DAY = 60 * 60 * 24;

export async function getCachedAIReport(
  userId: string,
  context: AIContext,
): Promise<AICoachResponse> {
  const key = `ai:report:${userId}`;

  const cached = await redis.get<AICoachResponse>(key);

  if (cached) {
    return cached;
  }

  const report = await generateAIReport(context);

  await redis.set(key, report, {
    ex: DAY,
  });

  return report;
}
