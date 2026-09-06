"use server";

import { and, desc, eq, gt } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

import { auth } from "@/auth";
import { db } from "@/lib/db";
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

const ai = new GoogleGenAI({
  apiKey,
});

const CACHE_TTL = 60 * 60 * 24;

function isValidInsight(item: unknown): item is AIInsight {
  if (!item || typeof item !== "object") {
    return false;
  }

  const value = item as Record<string, unknown>;

  return (
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    (value.type === "positive" ||
      value.type === "warning" ||
      value.type === "neutral")
  );
}

function isValidRecommendation(item: unknown): item is AIRecommendation {
  if (!item || typeof item !== "object") {
    return false;
  }

  const value = item as Record<string, unknown>;

  return (
    typeof value.title === "string" && typeof value.description === "string"
  );
}

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

  let parsed: Partial<AIInsightsResult>;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned malformed JSON.");
  }

  return {
    summary: typeof parsed.summary === "string" ? parsed.summary : "",

    insights: Array.isArray(parsed.insights)
      ? parsed.insights.filter(isValidInsight)
      : [],

    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.filter(isValidRecommendation)
      : [],
  };
}

export async function generateAIInsights(): Promise<AIInsightsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const now = new Date();

  const [cachedInsight] = await db
    .select()
    .from(aiInsights)
    .where(and(eq(aiInsights.userId, userId), gt(aiInsights.expiresAt, now)))
    .orderBy(desc(aiInsights.generatedAt))
    .limit(1);

  if (cachedInsight) {
    return {
      summary: cachedInsight.summary ?? "",
      insights: Array.isArray(cachedInsight.insights)
        ? cachedInsight.insights.filter(isValidInsight)
        : [],
      recommendations: Array.isArray(cachedInsight.recommendations)
        ? cachedInsight.recommendations.filter(isValidRecommendation)
        : [],
    };
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

    await db.insert(aiInsights).values({
      id: crypto.randomUUID(),
      userId,
      summary: result.summary,
      insights: result.insights,
      recommendations: result.recommendations,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_TTL * 1000),
    });

    return result;
  } catch (error: unknown) {
    console.error("AI Insights Generation Error:", error);

    const status =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status
        : undefined;

    const message = error instanceof Error ? error.message : "";

    if (
      status === 429 ||
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED") ||
      message.includes("quota")
    ) {
      throw new Error(
        "Gemini API quota exceeded. Please try again later or check your Gemini API billing and usage limits.",
      );
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to generate AI insights.",
    );
  }
}
