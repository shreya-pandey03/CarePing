import { GoogleGenAI } from "@google/genai";

import { buildCoachPrompt } from "./prompt";
import type { AIContext } from "./context";
import type { AICoachResponse } from "./types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateAIReport(
  context: AIContext,
): Promise<AICoachResponse> {
  const prompt = buildCoachPrompt(context);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text?.trim() ?? "";

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let json = text;

  if (json.startsWith("```json")) {
    json = json.replace("```json", "").replace("```", "").trim();
  }

  return JSON.parse(json) as AICoachResponse;
}
