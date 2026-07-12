"use client";

import { create } from "zustand";

import type { Recommendation } from "@/types/recommendation";

interface RecommendationState {
  recommendations: Recommendation[];

  selectedRecommendation: Recommendation | null;

  loading: boolean;

  setRecommendations: (recommendations: Recommendation[]) => void;

  addRecommendation: (recommendation: Recommendation) => void;

  updateRecommendation: (recommendation: Recommendation) => void;

  removeRecommendation: (id: string) => void;

  setSelectedRecommendation: (recommendation: Recommendation | null) => void;

  setLoading: (loading: boolean) => void;

  reset: () => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],

  selectedRecommendation: null,

  loading: false,

  setRecommendations: (recommendations) =>
    set({
      recommendations,
    }),

  addRecommendation: (recommendation) =>
    set((state) => ({
      recommendations: [recommendation, ...state.recommendations],
    })),

  updateRecommendation: (recommendation) =>
    set((state) => ({
      recommendations: state.recommendations.map((item) =>
        item.id === recommendation.id ? recommendation : item,
      ),
    })),

  removeRecommendation: (id) =>
    set((state) => ({
      recommendations: state.recommendations.filter((item) => item.id !== id),
    })),

  setSelectedRecommendation: (recommendation) =>
    set({
      selectedRecommendation: recommendation,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  reset: () =>
    set({
      recommendations: [],
      selectedRecommendation: null,
      loading: false,
    }),
}));
