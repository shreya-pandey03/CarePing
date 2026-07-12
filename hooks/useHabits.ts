"use client";

import { useEffect, useState } from "react";

import {
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
} from "@/actions/habits";

import type { Habit, HabitFormValues } from "@/types/habit";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function fetchHabits() {
    try {
      setLoading(true);

      setError(null);

      const data = await getHabits();

      setHabits(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load habits",
      );
    } finally {
      setLoading(false);
    }
  }

  async function addHabit(values: HabitFormValues) {
    try {
      const habit = await createHabit(values);

      setHabits((prev) => [...prev, habit]);

      return habit;
    } catch (error) {
      throw error;
    }
  }

  async function editHabit(id: string, values: Partial<HabitFormValues>) {
    try {
      const updatedHabit = await updateHabit(id, values);

      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? updatedHabit : habit)),
      );

      return updatedHabit;
    } catch (error) {
      throw error;
    }
  }

  async function removeHabit(id: string) {
    try {
      await deleteHabit(id);

      setHabits((prev) => prev.filter((habit) => habit.id !== id));
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    habits,
    loading,
    error,

    refresh: fetchHabits,

    addHabit,

    editHabit,

    removeHabit,
  };
}
