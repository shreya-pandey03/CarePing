import { create } from "zustand";

export interface RealtimeHabit {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  targetDays: number;
  reminderTime?: string | null;
  active: boolean;
}

interface Activity {
  type: string;
  habitId: string;
  timestamp: string;
}

interface RealtimeState {
  habits: RealtimeHabit[];

  activity: Activity[];

  setHabits: (habits: RealtimeHabit[]) => void;

  addHabit: (habit: RealtimeHabit) => void;

  updateHabit: (habit: RealtimeHabit) => void;

  removeHabit: (id: string) => void;

  completeHabit: (habitId: string) => void;

  addActivity: (activity: Activity) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  habits: [],

  activity: [],

  setHabits: (habits) =>
    set({
      habits,
    }),

  addHabit: (habit) =>
    set((state) => ({
      habits: [habit, ...state.habits],
    })),

  updateHabit: (habit) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === habit.id ? habit : h)),
    })),

  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),

  completeHabit: (habitId) =>
    set((state) => ({
      activity: [
        {
          type: "completed",
          habitId,
          timestamp: new Date().toISOString(),
        },
        ...state.activity,
      ],
    })),

  addActivity: (activity) =>
    set((state) => ({
      activity: [activity, ...state.activity],
    })),
}));
