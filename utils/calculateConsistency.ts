export function calculateConsistency(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return Number((total / values.length).toFixed(2));
}

export function calculateConsistencyPercentage(
  completed: number,
  expected: number,
): number {
  if (expected <= 0) {
    return 0;
  }

  return Number(((completed / expected) * 100).toFixed(2));
}

export function calculateWeeklyConsistency(dailyCompletions: number[]): number {
  return calculateConsistency(dailyCompletions);
}

export function calculateMonthlyConsistency(
  weeklyCompletions: number[],
): number {
  return calculateConsistency(weeklyCompletions);
}
