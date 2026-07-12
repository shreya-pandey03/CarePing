import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { streaks } from "@/drizzle/schema";

// Database Types

export type Streak = InferSelectModel<typeof streaks>;

export type NewStreak = InferInsertModel<typeof streaks>;

// Streak Stats

export interface StreakStats {
  currentStreak: number;

  longestStreak: number;

  totalCompletions: number;

  riskScore: number;

  lastCompletedAt?: Date | null;
}

// Dashboard

export interface StreakOverview {
  totalActiveStreaks: number;

  bestStreak: number;

  averageStreak: number;
}

// Prediction

export interface StreakPrediction {
  habitId: string;

  riskScore: number;

  confidence: number;

  recommendation: string;
}

// Response

export interface StreakResponse {
  success: boolean;

  streak?: Streak;

  message?: string;
}
