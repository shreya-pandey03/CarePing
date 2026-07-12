"use client";

import { create } from "zustand";

import type { AIInsight } from "@/types/insight";

interface InsightState {
  insights: AIInsight[];

  selectedInsight: AIInsight | null;

  loading: boolean;

  setInsights: (insights: AIInsight[]) => void;

  addInsight: (insight: AIInsight) => void;

  setSelectedInsight: (insight: AIInsight | null) => void;

  removeInsight: (id: string) => void;

  setLoading: (loading: boolean) => void;

  reset: () => void;
}

export const useInsightStore = create<InsightState>((set) => ({
  insights: [],

  selectedInsight: null,

  loading: false,

  setInsights: (insights) =>
    set({
      insights,
    }),

  addInsight: (insight) =>
    set((state) => ({
      insights: [insight, ...state.insights],
    })),

  setSelectedInsight: (insight) =>
    set({
      selectedInsight: insight,
    }),

  removeInsight: (id) =>
    set((state) => ({
      insights: state.insights.filter((item) => item.id !== id),
    })),

  setLoading: (loading) =>
    set({
      loading,
    }),

  reset: () =>
    set({
      insights: [],
      selectedInsight: null,
      loading: false,
    }),
}));
