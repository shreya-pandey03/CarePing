import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { recommendations } from "@/drizzle/schema";

// Database Types

export type Recommendation = InferSelectModel<typeof recommendations>;

export type NewRecommendation = InferInsertModel<typeof recommendations>;

// Recommendation Summary

export interface RecommendationSummary {
  title: string;

  description: string;

  priority: number;

  accepted: boolean;

  dismissed: boolean;
}

// Dashboard

export interface RecommendationOverview {
  total: number;

  pending: number;

  accepted: number;

  dismissed: number;
}

// Recommendation Card

export interface RecommendationCardData {
  recommendation: Recommendation;

  actionLabel?: string;
}

// Filters

export interface RecommendationFilters {
  accepted?: boolean;

  dismissed?: boolean;

  priority?: number;

  type?: Recommendation["type"];
}

// API Response

export interface RecommendationResponse {
  success: boolean;

  recommendations: Recommendation[];

  message?: string;
}
