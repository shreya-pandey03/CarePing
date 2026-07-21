"use client";

import { create } from "zustand";

export interface HabitRealtime {
  id: string;
  title: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  active: boolean;
  reminderTime?: string;
}

interface SocketStore {
  connected: boolean;

  habits: Record<string, HabitRealtime>;

  streaks: Record<string, number>;

  progress: Record<string, number>;

  setConnected: (connected: boolean) => void;

  addHabit: (habit: HabitRealtime) => void;

  updateHabit: (habit: HabitRealtime) => void;

  deleteHabit: (habitId: string) => void;

  completeHabit: (data: {
    habitId: string;
    streak: number;
    completion: number;
  }) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  connected: false,

  habits: {},

  streaks: {},

  progress: {},

  setConnected: (connected) =>
    set({
      connected,
    }),

  addHabit: (habit) =>
    set((state) => ({
      habits: {
        ...state.habits,
        [habit.id]: habit,
      },
    })),

  updateHabit: (habit) =>
    set((state) => ({
      habits: {
        ...state.habits,
        [habit.id]: habit,
      },
    })),

  deleteHabit: (habitId) =>
    set((state) => {
      const habits = { ...state.habits };
      delete habits[habitId];

      return {
        habits,
      };
    }),

  completeHabit: ({ habitId, streak, completion }) =>
    set((state) => ({
      streaks: {
        ...state.streaks,
        [habitId]: streak,
      },

      progress: {
        ...state.progress,
        [habitId]: completion,
      },
    })),
}));
