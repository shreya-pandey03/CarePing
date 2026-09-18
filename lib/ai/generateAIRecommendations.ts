"use server";

import { GoogleGenAI } from "@google/genai";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { buildAIContext } from "./context";

export interface AIRecommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  habitId?: string;
}

export interface AIRecommendationsResult {
  recommendations: AIRecommendation[];
  generatedAt: string;
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({ apiKey });

const CACHE_TTL = 60 * 60 * 24;

function parseRecommendations(text: string): AIRecommendationsResult {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
    throw new Error("Gemini did not return valid JSON.");
  }

  const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as {
    recommendations?: unknown;
  };

  const recommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations.filter(
        (item): item is AIRecommendation =>
          (!!item &&
            typeof item === "object" &&
            typeof (item as AIRecommendation).title === "string" &&
            typeof (item as AIRecommendation).description === "string" &&
            (item as AIRecommendation).priority === "high") ||
          (item as AIRecommendation).priority === "medium" ||
          (item as AIRecommendation).priority === "low",
      )
    : [];

  return {
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateAIRecommendations(options?: {
  force?: boolean;
}): Promise<AIRecommendationsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const force = options?.force ?? false;

  const cacheKey = `ai-recommendations:${userId}`;

  if (!force) {
    const cached = await redis.get(cacheKey);

    if (cached) {
      try {
        return JSON.parse(cached) as AIRecommendationsResult;
      } catch {
        await redis.del(cacheKey);
      }
    }
  }

  const [userHabits, userLogs, userStreaks] = await Promise.all([
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

  const context = buildAIContext(userHabits, userLogs, userStreaks);

  const prompt = `
You are an expert AI Habit Coach.

Generate personalized, practical recommendations based ONLY on the user's provided habit analytics.

RULES:

1. Never invent habits or statistics.
2. Respect each habit's frequency and targetDays.
3. Do not treat longestStreak as the current streak.
4. Do not treat historical streaks as this week's streaks.
5. Prioritize habits with poor health scores or high streak risk.
6. Consider current streaks, longest streaks, completion rate, weekly performance and risk.
7. Recommendations must be actionable.
8. Do not recommend completing a habit every day unless its frequency is daily.
9. Do not recommend changing a habit's target without evidence.
10. Do not make medical, financial, or psychological claims.
11. Keep recommendations concise.
12. Return JSON only.
13. Do not return Markdown.
14. Do not return code fences.
15. Do not invent reasons for poor performance.

Recommendation priority:

- high = immediate attention needed
- medium = useful improvement
- low = maintenance or optimization

USER DATA:

${JSON.stringify(context, null, 2)}

Return EXACTLY:

{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Specific actionable recommendation",
      "priority": "high | medium | low",
      "habitId": "habit id when directly related to a habit"
    }
  ]
}

Generate between 3 and 5 recommendations.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const result = parseRecommendations(text);

    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

    return result;
  } catch (error) {
    console.error("AI Recommendations Generation Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to generate AI recommendations.");
  }
}
