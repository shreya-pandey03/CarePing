"use client";

import { useEffect, useState } from "react";

import { getAnalyticsData } from "@/actions/analytics/getAnalyticsData";

import type { DashboardAnalytics } from "@/types/analytics";

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function fetchAnalytics() {
    try {
      setLoading(true);

      setError(null);

      const data = await getAnalyticsData();

      setAnalytics(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load analytics",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,

    loading,

    error,

    refresh: fetchAnalytics,
  };
}
