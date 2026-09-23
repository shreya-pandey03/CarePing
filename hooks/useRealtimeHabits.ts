"use client";

import { useEffect } from "react";

import { useRealtimeStore } from "@/store/realtimeStore";

export interface Habit {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  targetDays: number;
  reminderTime?: string | null;
  active: boolean;
}

export function useRealtimeHabits(initialHabits: Habit[]) {
  const habits = useRealtimeStore((state) => state.habits);

  const setHabits = useRealtimeStore((state) => state.setHabits);

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits, setHabits]);

  return habits;
}
