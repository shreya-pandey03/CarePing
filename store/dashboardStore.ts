"use client";

import { create } from "zustand";

import type { DashboardAnalytics } from "@/types/analytics";

import type { AIInsight } from "@/types/insight";

import type { Recommendation } from "@/types/recommendation";

import type { Habit } from "@/types/habit";

interface DashboardState {
  habits: Habit[];

  analytics: DashboardAnalytics | null;

  insights: AIInsight[];

  recommendations: Recommendation[];

  loading: boolean;

  setHabits: (habits: Habit[]) => void;

  setAnalytics: (analytics: DashboardAnalytics) => void;

  setInsights: (insights: AIInsight[]) => void;

  setRecommendations: (recommendations: Recommendation[]) => void;

  setLoading: (loading: boolean) => void;

  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  habits: [],

  analytics: null,

  insights: [],

  recommendations: [],

  loading: false,

  setHabits: (habits) =>
    set({
      habits,
    }),

  setAnalytics: (analytics) =>
    set({
      analytics,
    }),

  setInsights: (insights) =>
    set({
      insights,
    }),

  setRecommendations: (recommendations) =>
    set({
      recommendations,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  reset: () =>
    set({
      habits: [],
      analytics: null,
      insights: [],
      recommendations: [],
      loading: false,
    }),
}));
