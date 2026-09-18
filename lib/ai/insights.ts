"use server";

import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";


import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { buildInsightsPrompt } from "./prompt";
import { buildAIContext } from "./context";

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

export async function generateAIInsights(): Promise<AIInsightsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

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

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Gemini did not return valid JSON.");
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const result = JSON.parse(cleaned) as Partial<AIInsightsResult>;

    return {
      summary: typeof result.summary === "string" ? result.summary : "",

      insights: Array.isArray(result.insights)
        ? result.insights.filter(
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

      recommendations: Array.isArray(result.recommendations)
        ? result.recommendations.filter(
            (item): item is AIRecommendation =>
              !!item &&
              typeof item === "object" &&
              typeof item.title === "string" &&
              typeof item.description === "string",
          )
        : [],
    };
  } catch (error) {
    console.error("AI Insights Generation Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to generate AI insights.");
  }
}
