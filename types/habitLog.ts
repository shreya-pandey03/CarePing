import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { habitLogs } from "@/drizzle/schema";

/*  Database Types  */

export type HabitLog = InferSelectModel<typeof habitLogs>;

export type NewHabitLog = InferInsertModel<typeof habitLogs>;

/* Log Statistics  */

export interface HabitLogStats {
  totalLogs: number;

  completedLogs: number;

  missedLogs: number;

  completionRate: number;

  averageValue: number;
}

/*  Daily Activity */

export interface DailyHabitLog {
  date: string;

  completed: boolean;

  value?: number | null;

  notes?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                               Weekly Summary                               */
/* -------------------------------------------------------------------------- */

export interface WeeklyHabitLogSummary {
  weekStart: Date;

  weekEnd: Date;

  completedDays: number;

  expectedDays: number;

  completionRate: number;
}

/*Monthly Summary */

export interface MonthlyHabitLogSummary {
  month: number;

  year: number;

  completedDays: number;

  expectedDays: number;

  completionRate: number;
}

/*  Heatmap Data  */

export interface HeatmapCell {
  date: string;

  count: number;

  intensity: 0 | 1 | 2 | 3 | 4;
}

/* -------------------------------------------------------------------------- */
/*                              Calendar Event                                */
/* -------------------------------------------------------------------------- */

export interface HabitCalendarEvent {
  id: string;

  habitId: string;

  title: string;

  completedAt: Date;

  completed: boolean;
}

/*  Completion Trend  */

export interface CompletionTrend {
  label: string;

  completed: number;

  expected: number;
}

/*  Logging Payload   */

export interface CreateHabitLogInput {
  habitId: string;

  completed?: boolean;

  value?: number;

  notes?: string;
}
