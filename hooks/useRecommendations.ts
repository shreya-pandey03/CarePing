"use client";

import { useEffect, useState } from "react";

import {
  getRecommendations,
  acceptRecommendation,
  dismissRecommendation,
} from "@/actions/recommendations";

import type { Recommendation } from "@/types/recommendation";

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function fetchRecommendations() {
    try {
      setLoading(true);

      setError(null);

      const data = await getRecommendations();

      setRecommendations(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load recommendations",
      );
    } finally {
      setLoading(false);
    }
  }

  async function accept(id: string) {
    try {
      await acceptRecommendation(id);

      setRecommendations((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                accepted: true,
              }
            : item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async function dismiss(id: string) {
    try {
      await dismissRecommendation(id);

      setRecommendations((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                dismissed: true,
              }
            : item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,

    loading,

    error,

    refresh: fetchRecommendations,

    accept,

    dismiss,
  };
}
