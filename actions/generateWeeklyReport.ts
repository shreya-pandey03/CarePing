"use server";

import { z } from "zod";
import { buildWeeklyReportPrompt } from "@/lib/promptBuilder";
import { generateWeeklyReport as generateAIWeeklyReport } from "@/lib/gemini";

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

export type GenerateWeeklyReportInput = z.infer<typeof inputSchema>;

export interface WeeklyReportResult {
  title: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export async function generateWeeklyReport(
  input: GenerateWeeklyReportInput,
): Promise<WeeklyReportResult> {
  const validated = inputSchema.parse(input);

  const prompt = buildWeeklyReportPrompt({
    habits: validated.habits,
    logs: validated.logs,
    streaks: validated.streaks,
  });

  const report = await generateAIWeeklyReport(prompt);

  return {
    title: report.title,
    summary: report.summary,
    strengths: report.strengths,
    improvements: report.improvements,
    recommendations: report.recommendations,
  };
}
