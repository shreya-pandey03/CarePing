import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { habits } from "@/drizzle/schema";

/*   Database Types*/

export type Habit = InferSelectModel<typeof habits>;

export type NewHabit = InferInsertModel<typeof habits>;

/*  Habit Form */

export interface HabitFormValues {
  title: string;

  description?: string;

  category:
    | "health"
    | "fitness"
    | "reading"
    | "learning"
    | "coding"
    | "career"
    | "finance"
    | "mindfulness"
    | "nutrition"
    | "custom";

  frequency: "daily" | "weekly" | "monthly";

  targetDays: number;

  color?: string;

  icon?: string;

  reminderTime?: string;

  active: boolean;
}

/* Habit Statistics  */

export interface HabitStats {
  currentStreak: number;

  longestStreak: number;

  completionRate: number;

  totalCompletions: number;

  completedToday: boolean;

  lastCompletedAt?: Date | null;
}

/* Dashboard Card */

export interface HabitCardData {
  habit: Habit;

  stats: HabitStats;
}

/*  Dashboard Summary */

export interface HabitDashboardSummary {
  totalHabits: number;

  activeHabits: number;

  archivedHabits: number;

  completedToday: number;

  completionRate: number;
}

/* -------------------------------------------------------------------------- */
/*                              Heatmap Entry                                 */
/* -------------------------------------------------------------------------- */

export interface HabitHeatmapEntry {
  date: string;

  completed: number;

  total: number;
}

/* Habit Calendar  */

export interface HabitCalendarDay {
  date: Date;

  completed: boolean;

  value?: number;
}

/*  Habit Progress  */

export interface HabitProgress {
  weekly: number;

  monthly: number;

  yearly: number;
}

/*  AI Recommendation  */

export interface HabitRecommendation {
  title: string;

  description: string;

  priority: number;
}

/*  Habit Risk Analysis */

export interface HabitRisk {
  score: number;

  level: "low" | "medium" | "high";

  message: string;
}

/* Habit Filter */

export interface HabitFilters {
  search: string;

  category: string;

  frequency: string;

  activeOnly: boolean;

  archivedOnly: boolean;
}
