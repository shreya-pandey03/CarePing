import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { aiInsights } from "@/drizzle/schema";

// Database Types

export type AIInsight = InferSelectModel<typeof aiInsights>;

export type NewAIInsight = InferInsertModel<typeof aiInsights>;

// Insight Summary

export interface InsightSummary {
  title: string;

  summary: string;

  content: string;

  metadata?: Record<string, unknown>;
}

// Dashboard

export interface InsightOverview {
  totalInsights: number;

  latestInsight?: AIInsight;

  unreadInsights: number;
}

// Streak Prediction

export interface StreakPrediction {
  riskScore: number;

  confidence: number;

  level: "low" | "medium" | "high";

  message: string;
}

// Motivation

export interface MotivationMessage {
  title: string;

  message: string;

  quote?: string;
}

// AI Response

export interface InsightResponse {
  success: boolean;

  insight?: AIInsight;

  message?: string;
}
