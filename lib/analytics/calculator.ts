import { Habit, HabitLog } from "@/drizzle/schema";

export function calculateCompletionPercentage(
  habits: Habit[],
  logs: HabitLog[],
  startDate: Date,
  endDate: Date,
) {
  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

  const activeHabits = habits.filter((habit) => habit.createdAt <= endDate);

  const expectedCompletions = activeHabits.length * totalDays;

  const completed = logs.filter((log) => {
    return log.completedAt >= startDate && log.completedAt <= endDate;
  }).length;

  return {
    expectedCompletions,
    completed,
    completionRate:
      expectedCompletions === 0
        ? 0
        : Math.round((completed / expectedCompletions) * 100),
  };
}
