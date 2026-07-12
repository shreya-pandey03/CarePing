import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { habitCorrelations } from "@/drizzle/schema";

// Database Types

export type HabitCorrelation = InferSelectModel<typeof habitCorrelations>;

export type NewHabitCorrelation = InferInsertModel<typeof habitCorrelations>;

// Overview

export interface AnalyticsOverview {
  completionRate: number;

  consistency: number;

  currentStreak: number;

  longestStreak: number;

  totalHabits: number;

  completedHabits: number;
}

// Chart Data

export interface ChartData {
  label: string;

  value: number;
}

// Weekly Analytics

export interface WeeklyAnalytics {
  weekStart: Date;

  weekEnd: Date;

  completionRate: number;

  consistency: number;

  completedHabits: number;

  totalHabits: number;
}

// Monthly Analytics

export interface MonthlyAnalytics {
  month: number;

  year: number;

  completionRate: number;

  consistency: number;

  completedHabits: number;

  totalHabits: number;
}

// Heatmap

export interface HeatmapData {
  date: string;

  count: number;

  intensity: number;
}

// Streak Analytics

export interface StreakAnalytics {
  current: number;

  longest: number;

  totalCompletions: number;

  riskScore: number;
}

// Correlation

export interface CorrelationData {
  habitAId: string;

  habitBId: string;

  correlationScore: number;

  insight?: string | null;
}

// Progress

export interface ProgressAnalytics {
  daily: number;

  weekly: number;

  monthly: number;

  yearly: number;
}

// Dashboard

export interface DashboardAnalytics {
  overview: AnalyticsOverview;

  completionChart: ChartData[];

  consistencyChart: ChartData[];

  streakChart: ChartData[];

  heatmap: HeatmapData[];
}
