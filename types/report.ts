import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { weeklyReports, monthlyReports } from "@/drizzle/schema";

// Database Types

export type WeeklyReport = InferSelectModel<typeof weeklyReports>;

export type NewWeeklyReport = InferInsertModel<typeof weeklyReports>;

export type MonthlyReport = InferSelectModel<typeof monthlyReports>;

export type NewMonthlyReport = InferInsertModel<typeof monthlyReports>;

// Weekly Report

export interface WeeklyReportSummary {
  title: string;

  summary: string;

  strengths: string[];

  improvements: string[];

  recommendations: string[];
}

// Monthly Report

export interface MonthlyReportSummary {
  report: string;

  aiSummary?: string | null;

  completionRate: number;

  totalHabits: number;

  completedHabits: number;
}

// Dashboard Reports

export interface ReportOverview {
  weeklyCompleted: boolean;

  monthlyCompleted: boolean;

  latestWeeklyReport?: WeeklyReport;

  latestMonthlyReport?: MonthlyReport;
}

// AI Report

export interface AIReportResponse {
  success: boolean;

  report: WeeklyReport | MonthlyReport;

  generatedAt: Date;
}

// Report Filters

export interface ReportFilters {
  year?: number;

  month?: number;

  week?: number;
}
