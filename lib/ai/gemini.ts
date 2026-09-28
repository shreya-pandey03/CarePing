import { GoogleGenAI } from "@google/genai";

import { buildCoachPrompt } from "./prompt";
import type { AIContext } from "./context";
import type { AICoachResponse } from "./types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

export const GEMINI_MODEL = "gemini-2.5-flash";
export const gemini = new GoogleGenAI({
  apiKey,
});

export async function generateAIReport(
  context: AIContext,
): Promise<AICoachResponse> {
  const prompt = buildCoachPrompt(context);

  try {
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    let json = text;

    // Remove Markdown code fences if Gemini returns them.
    if (json.startsWith("```")) {
      json = json
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    // Handle accidental text before/after JSON.
    const firstBrace = json.indexOf("{");
    const lastBrace = json.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
      console.error("Invalid Gemini response:", text);
      throw new Error("Gemini did not return valid JSON.");
    }

    json = json.slice(firstBrace, lastBrace + 1);

    let parsed: unknown;

    try {
      parsed = JSON.parse(json);
    } catch (error) {
      console.error("Failed to parse Gemini JSON:", json);
      console.error("JSON parse error:", error);

      throw new Error("Gemini returned invalid JSON.");
    }

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Gemini returned an invalid AI report.");
    }

    return parsed as AICoachResponse;
  } catch (error) {
    console.error("AI Report Generation Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to generate AI report.");
  }
}
