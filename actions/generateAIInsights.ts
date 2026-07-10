"use server";

import { z } from "zod";

import { generateInsight } from "@/lib/gemini";
import { buildInsightPrompt } from "@/lib/promptBuilder";


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

type Input = z.infer<typeof inputSchema>;

interface AIInsightResult {
  title: string;
  summary: string;
  content: string;
}

export async function generateAIInsights(
  input: Input
): Promise<AIInsightResult> {
  const validated = inputSchema.parse(input);

  const prompt = buildInsightPrompt({
    habits: validated.habits,
    logs: validated.logs,
    streaks: validated.streaks,
  });

  const response = await generateInsight(prompt);

  return {
    title: response.title,
    summary: response.summary,
    content: response.content,
  };
}