import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in your environment variables.");
}

export const ai = new GoogleGenAI({
  apiKey,
});

export interface AIInsight {
  title: string;
  summary: string;
  content: string;
}

export async function generateInsight(prompt: string): Promise<AIInsight> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsed = JSON.parse(text);

    return {
      title: parsed.title,
      summary: parsed.summary,
      content: parsed.content,
    };
  } catch (error) {
    console.error("Gemini Error:", error);

    throw new Error("Failed to generate AI insight.");
  }
}

export interface WeeklyReport {
  title: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export async function generateWeeklyReport(
  prompt: string,
): Promise<WeeklyReport> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Weekly Report Error:", error);

    throw error;
  }
}

export interface RecommendationResult {
  recommendations: string[];
}

export async function generateRecommendations(
  prompt: string,
): Promise<RecommendationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Recommendation Error:", error);

    throw error;
  }
}

export interface MotivationResult {
  message: string;
}

export async function generateMotivation(
  prompt: string,
): Promise<MotivationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1,
        maxOutputTokens: 256,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Motivation Error:", error);

    throw error;
  }
}

export interface GoalOptimizationResult {
  title: string;
  description: string;
  targetValue: number;
  deadline: string;
  reason: string;
}

export async function generateGoalOptimization(
  prompt: string,
): Promise<GoalOptimizationResult[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: prompt,

      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned empty response");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Goal Optimization Error:", error);

    throw new Error("Failed to optimize goal");
  }
}
