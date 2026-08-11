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

  // Check Redis cache
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached) as AICoachResponse;
  }

  // Generate fresh AI report
  const report = await generateAIReport(context);

  // Store in Redis for 24 hours
  await redis.set(key, JSON.stringify(report), "EX", DAY);

  return report;
}
