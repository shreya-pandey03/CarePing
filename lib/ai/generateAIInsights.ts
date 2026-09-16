"use server";

import { desc, eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { habits, habitLogs, streaks, aiInsights } from "@/drizzle/schema";
import { buildAIContext } from "./context";
import { buildInsightsPrompt } from "./prompt";

export interface AIInsight {
  title: string;
  description: string;
  type: "positive" | "warning" | "neutral";
}

export interface AIRecommendation {
  title: string;
  description: string;
}

export interface AIInsightsResult {
  summary: string;
  insights: AIInsight[];
  recommendations: AIRecommendation[];
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({ apiKey });

const CACHE_TTL = 60 * 60 * 24;
const DB_REUSE_WINDOW = 60 * 60 * 1000;

function parseAIResponse(text: string): AIInsightsResult {
  let cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
    throw new Error("Gemini did not return valid JSON.");
  }

  cleaned = cleaned.slice(firstBrace, lastBrace + 1);

  const parsed = JSON.parse(cleaned) as Partial<AIInsightsResult>;

  return {
    summary: typeof parsed.summary === "string" ? parsed.summary : "",

    insights: Array.isArray(parsed.insights)
      ? parsed.insights.filter(
          (item): item is AIInsight =>
            !!item &&
            typeof item === "object" &&
            typeof item.title === "string" &&
            typeof item.description === "string" &&
            (item.type === "positive" ||
              item.type === "warning" ||
              item.type === "neutral"),
        )
      : [],

    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.filter(
          (item): item is AIRecommendation =>
            !!item &&
            typeof item === "object" &&
            typeof item.title === "string" &&
            typeof item.description === "string",
        )
      : [],
  };
}

export async function generateAIInsights(options?: {
  force?: boolean;
}): Promise<AIInsightsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const force = options?.force ?? false;
  const cacheKey = `ai-insights:${userId}`;

  if (!force) {
    const cached = await redis.get(cacheKey);

    if (cached) {
      try {
        return JSON.parse(cached) as AIInsightsResult;
      } catch {
        await redis.del(cacheKey);
      }
    }

    const latestInsight = await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.userId, userId))
      .orderBy(desc(aiInsights.generatedAt))
      .limit(1);

    if (latestInsight.length > 0) {
      const latest = latestInsight[0];

      const generatedAt = new Date(latest.generatedAt).getTime();

      const expiresAt = latest.expiresAt
        ? new Date(latest.expiresAt).getTime()
        : 0;

      const now = Date.now();

      if (now - generatedAt < DB_REUSE_WINDOW && expiresAt > now) {
        const result: AIInsightsResult = {
          summary: latest.summary,

          insights: Array.isArray(latest.insights)
            ? latest.insights.filter(
                (item): item is AIInsight =>
                  !!item &&
                  typeof item === "object" &&
                  typeof item.title === "string" &&
                  typeof item.description === "string" &&
                  (item.type === "positive" ||
                    item.type === "warning" ||
                    item.type === "neutral"),
              )
            : [],

          recommendations: Array.isArray(latest.recommendations)
            ? latest.recommendations.filter(
                (item): item is AIRecommendation =>
                  !!item &&
                  typeof item === "object" &&
                  typeof item.title === "string" &&
                  typeof item.description === "string",
              )
            : [],
        };

        await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

        return result;
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

  const prompt = buildInsightsPrompt(context);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const result = parseAIResponse(text);

    const generatedAt = new Date();

    const expiresAt = new Date(generatedAt.getTime() + CACHE_TTL * 1000);

    await db.insert(aiInsights).values({
      id: crypto.randomUUID(),
      userId,
      summary: result.summary,
      insights: result.insights,
      recommendations: result.recommendations,
      generatedAt,
      expiresAt,
    });

    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

    return result;
  } catch (error) {
    console.error("AI Insights Generation Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to generate AI insights.");
  }
}
