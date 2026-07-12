"use client";

import { create } from "zustand";

import type { DashboardAnalytics } from "@/types/analytics";

interface AnalyticsState {
  analytics: DashboardAnalytics | null;

  loading: boolean;

  setAnalytics: (analytics: DashboardAnalytics) => void;

  setLoading: (loading: boolean) => void;

  clearAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: null,

  loading: false,

  setAnalytics: (analytics) =>
    set({
      analytics,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  clearAnalytics: () =>
    set({
      analytics: null,
    }),
}));
