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
  setHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string, streak: number, completion: number) => void;
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
  setHabit: (habit) =>
    set((state) => ({
      habits: [...state.habits, habit],
    })),

  updateHabit: (habit) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === habit.id ? habit : h)),
    })),

  deleteHabit: (habitId) =>
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== habitId),
    })),

  completeHabit: (habitId, streak, completion) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              streak,
              completion,
            }
          : habit,
      ),
    })),

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
