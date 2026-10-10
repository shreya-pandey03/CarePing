"use server";

import { GoogleGenAI } from "@google/genai";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { buildAIContext } from "./context";

export interface AIRecommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  habitId?: string;
}

export interface AIRecommendationsResult {
  recommendations: AIRecommendation[];
  generatedAt: string;
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({ apiKey });

const CACHE_TTL = 60 * 60 * 24;

function parseRecommendations(
  text: string,
  validHabitIds: Set<string>,
): AIRecommendation[] {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
    throw new Error("Gemini did not return valid JSON.");
  }

  const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as {
    recommendations?: unknown;
  };

  if (!Array.isArray(parsed.recommendations)) {
    throw new Error("Gemini returned an invalid recommendations array.");
  }

  return parsed.recommendations
    .filter((item): item is Record<string, unknown> => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const recommendation = item as Record<string, unknown>;

      return (
        typeof recommendation.title === "string" &&
        recommendation.title.trim().length > 0 &&
        typeof recommendation.description === "string" &&
        recommendation.description.trim().length > 0 &&
        ["high", "medium", "low"].includes(recommendation.priority as string)
      );
    })
    .map((item) => {
      const habitId =
        typeof item.habitId === "string" && validHabitIds.has(item.habitId)
          ? item.habitId
          : undefined;

      return {
        title: (item.title as string).trim(),
        description: (item.description as string).trim(),
        priority: item.priority as AIRecommendation["priority"],
        ...(habitId ? { habitId } : {}),
      };
    })
    .slice(0, 5);
}

export async function generateAIRecommendations(options?: {
  force?: boolean;
}): Promise<AIRecommendationsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const force = options?.force ?? false;
  const cacheKey = `ai-recommendations:${userId}`;

  if (!force) {
    const cached = await redis.get(cacheKey);

    if (cached) {
      try {
        return JSON.parse(cached) as AIRecommendationsResult;
      } catch {
        await redis.del(cacheKey);
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

  const activeHabits = userHabits.filter(
    (habit) => habit.active && !habit.archived,
  );

  const activeHabitIds = new Set(activeHabits.map((habit) => habit.id));

  const activeLogs = userLogs.filter((log) => activeHabitIds.has(log.habitId));

  const activeStreaks = userStreaks.filter((streak) =>
    activeHabitIds.has(streak.habitId),
  );

  const context = buildAIContext(activeHabits, activeLogs, activeStreaks);

  const prompt = `
You are an accurate, practical AI Habit Coach.

Generate 3 to 5 personalized recommendations using only the supplied user data.

STRICT DATA RULES:

1. Never invent statistics, habits, dates, streaks, scores, or events.
2. Use only habit titles and IDs present in the supplied data.
3. Respect each habit's frequency and targetDays.
4. A daily completion rate is not the same as weekly completion.
5. A weekly grade is not the same as a completion percentage.
6. A current streak is not the same as a historical longest streak.
7. Never claim that a historical streak occurred this week unless the data proves it.
8. weeklyCompletedCount is the number of recorded completions, not the number of unique habits.
9. weeklyExpectedCount is the expected number of completions, not the number of habits.
10. weeklyMissedCount must not be described as the number of different habits.
11. Do not quote a statistic unless it is explicitly present in the supplied data.
12. Do not claim all habits have a particular health score or streak unless the data supports that claim.
13. Do not claim a habit is at high risk solely because its current streak is short.
14. A habit completed today can still need consistency improvements, but explain this without contradicting today's completion.
15. If metrics appear inconsistent, avoid quoting the conflicting numbers.
16. Respect daily, weekly, and monthly frequencies. Do not tell users to complete weekly or monthly habits every day.
17. Do not invent reasons for missed completions.
18. Give practical, specific actions that the user can follow.
19. Use high priority only for a clearly supported, important issue.
20. If the data shows strong performance, recommend maintaining it rather than manufacturing problems.

PRIORITY:

- high: a clearly supported issue needing prompt attention
- medium: a useful, measurable improvement
- low: maintenance or an optional optimization

USER ANALYTICS:

${JSON.stringify(context, null, 2)}

Return valid JSON only, with this structure:

{
  "recommendations": [
    {
      "title": "Short recommendation title",
      "description": "Specific, realistic action based on the supplied data",
      "priority": "high",
      "habitId": "existing habit ID when relevant"
    }
  ]
}

Use "medium" or "low" when appropriate instead of marking every recommendation high priority.
Omit habitId when a recommendation applies generally.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const recommendations = parseRecommendations(text, activeHabitIds);

    if (recommendations.length === 0) {
      throw new Error("Gemini returned no valid recommendations.");
    }

    const result: AIRecommendationsResult = {
      recommendations,
      generatedAt: new Date().toISOString(),
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

    return result;
  } catch (error) {
    console.error("AI Recommendations Generation Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to generate AI recommendations.");
  }
}
