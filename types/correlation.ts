import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { habitCorrelations } from "@/drizzle/schema";

// Database Types

export type HabitCorrelation = InferSelectModel<typeof habitCorrelations>;

export type NewHabitCorrelation = InferInsertModel<typeof habitCorrelations>;

// Correlation Result

export interface CorrelationResult {
  habitAId: string;

  habitBId: string;

  correlationScore: number;

  insight?: string | null;
}

// Dashboard

export interface CorrelationOverview {
  strongest: CorrelationResult[];

  weakest: CorrelationResult[];

  averageScore: number;
}

// AI Analysis

export interface CorrelationAnalysis {
  positive: CorrelationResult[];

  negative: CorrelationResult[];

  suggestions: string[];
}
