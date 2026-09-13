"use server";

import { eq } from "drizzle-orm";
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

export async function generateAIInsights(): Promise<AIInsightsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const cacheKey = `ai-insights:${userId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    try {
      return JSON.parse(cached) as AIInsightsResult;
    } catch {
      await redis.del(cacheKey);
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

    const result: AIInsightsResult = {
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

    await db.insert(aiInsights).values({
      id: crypto.randomUUID(),
      userId,
      summary: result.summary,
      insights: result.insights,
      recommendations: result.recommendations,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_TTL * 1000),
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
