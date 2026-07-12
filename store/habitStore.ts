"use client";

import { create } from "zustand";

import type { Habit } from "@/types/habit";

interface HabitState {
  habits: Habit[];

  selectedHabit: Habit | null;

  loading: boolean;

  setHabits: (habits: Habit[]) => void;

  addHabit: (habit: Habit) => void;

  updateHabit: (habit: Habit) => void;

  removeHabit: (id: string) => void;

  setSelectedHabit: (habit: Habit | null) => void;

  setLoading: (loading: boolean) => void;

  reset: () => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],

  selectedHabit: null,

  loading: false,

  setHabits: (habits) =>
    set({
      habits,
    }),

  addHabit: (habit) =>
    set((state) => ({
      habits: [...state.habits, habit],
    })),

  updateHabit: (habit) =>
    set((state) => ({
      habits: state.habits.map((item) => (item.id === habit.id ? habit : item)),
    })),

  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id),
    })),

  setSelectedHabit: (habit) =>
    set({
      selectedHabit: habit,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  reset: () =>
    set({
      habits: [],
      selectedHabit: null,
      loading: false,
    }),
}));
