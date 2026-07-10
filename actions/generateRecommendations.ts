"use server";

import { z } from "zod";
import { buildRecommendationPrompt } from "@/lib/promptBuilder";
import { generateRecommendations as generateAIRecommendations } from "@/lib/gemini";

const habitSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
});

const logSchema = z.object({
  completedAt: z.date(),
});

const streakSchema = z.object({
  currentStreak: z.number(),
  longestStreak: z.number(),
});

const inputSchema = z.object({
  habits: z.array(habitSchema),
  logs: z.array(logSchema),
  streaks: z.array(streakSchema),
});

export type GenerateRecommendationsInput = z.infer<typeof inputSchema>;

export interface RecommendationResult {
  recommendations: string[];
}

export async function generateRecommendations(
  input: GenerateRecommendationsInput,
): Promise<RecommendationResult> {
  const validated = inputSchema.parse(input);

  const prompt = buildRecommendationPrompt({
    habits: validated.habits,
    logs: validated.logs,
    streaks: validated.streaks,
  });

  const response = await generateAIRecommendations(prompt);

  return {
    recommendations: response.recommendations,
  };
}
