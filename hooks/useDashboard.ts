"use client";

import { useEffect, useState } from "react";

import { getDashboardData } from "@/actions/dashboard/getDashboardData";

export interface DashboardData {
  stats: unknown;
  habits: unknown[];
  weeklyReport: unknown | null;
  monthlyReport: unknown | null;
  insights: unknown[];
  recommendations: unknown[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);

      setError(null);

      const result = await getDashboardData();

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
