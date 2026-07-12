export function calculateCompletionRate(
  completed: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Number(((completed / total) * 100).toFixed(2));
}

export function calculateDailyCompletionRate(
  completedToday: number,
  totalHabits: number,
): number {
  return calculateCompletionRate(completedToday, totalHabits);
}

export function calculateWeeklyCompletionRate(
  completedDays: number,
  expectedDays: number,
): number {
  return calculateCompletionRate(completedDays, expectedDays);
}

export function calculateMonthlyCompletionRate(
  completedDays: number,
  expectedDays: number,
): number {
  return calculateCompletionRate(completedDays, expectedDays);
}
