"use client";

import { useEffect, useState } from "react";

import { getInsights } from "@/actions/insights/getInsights";

import type { AIInsight } from "@/types/insight";

export function useInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function fetchInsights() {
    try {
      setLoading(true);

      setError(null);

      const data = await getInsights();

      setInsights(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load insights",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInsights();
  }, []);

  return {
    insights,

    loading,

    error,

    refresh: fetchInsights,
  };
}
