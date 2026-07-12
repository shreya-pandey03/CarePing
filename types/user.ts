import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { users } from "@/drizzle/schema";

/**
 * Database Models
 */

export type User = InferSelectModel<typeof users>;

export type NewUser = InferInsertModel<typeof users>;

/**
 * Authentication User
 */

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

/**
 * Public User Profile
 */

export interface UserProfile {
  id: string;

  name: string | null;

  email: string | null;

  image: string | null;

  joinedAt?: Date;

  totalHabits: number;

  completedHabits: number;

  currentStreak: number;

  longestStreak: number;
}

/**
 * Dashboard Summary
 */

export interface UserDashboardStats {
  totalHabits: number;

  activeHabits: number;

  completedToday: number;

  currentStreak: number;

  longestStreak: number;

  completionRate: number;

  consistencyScore: number;

  weeklyProgress: number;

  monthlyProgress: number;
}

/**
 * User Preferences
 */

export interface UserPreferences {
  theme: "light" | "dark" | "system";

  emailNotifications: boolean;

  reminderNotifications: boolean;

  weeklyReports: boolean;

  monthlyReports: boolean;

  aiInsights: boolean;
}

/**
 * Account Settings
 */

export interface UserSettings {
  profile: UserProfile;

  preferences: UserPreferences;
}

/**
 * API Response
 */

export interface UserResponse {
  success: boolean;

  message?: string;

  user?: User;
}
