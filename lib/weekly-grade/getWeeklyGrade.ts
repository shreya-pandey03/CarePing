import type { WeeklyGrade } from "./types";
import { calculateWeeklyGrade } from "./calculateWeeklyGrade";

interface Habit {
  id: string;
  frequency: string;
}

interface HabitLog {
  habitId: string;
  completedAt: Date;
}

export function getWeeklyGrade(habits: Habit[], logs: HabitLog[]): WeeklyGrade {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  const activeHabits = habits.filter((habit) => habit.frequency === "daily");

  const expected = activeHabits.length * 7;

  const completedDays = new Set<string>();

  for (const log of logs) {
    const date = new Date(log.completedAt);

    if (date >= start && date <= now) {
      const key = `${log.habitId}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      completedDays.add(key);
    }
  }

  const completed = Array.from(completedDays).filter((key) => {
    const habitId = key.split("-")[0];

    return activeHabits.some((habit) => habit.id === habitId);
  }).length;

  return calculateWeeklyGrade({
    completed,
    expected,
  });
}
