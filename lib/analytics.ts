/**
 * Completion percentage
 */
export function calculateCompletionRate(
  completed: number,
  expected: number,
): number {
  if (expected <= 0) {
    return 0;
  }

  return Number(((completed / expected) * 100).toFixed(2));
}

/**
 * Average consistency score
 */
export function calculateConsistency(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return Number((total / values.length).toFixed(2));
}

/**
 * Current streak
 */
export function calculateCurrentStreak(
  streaks: { currentStreak: number }[],
): number {
  if (streaks.length === 0) {
    return 0;
  }

  return Math.max(...streaks.map((s) => s.currentStreak));
}

/**
 * Longest streak
 */
export function calculateLongestStreak(
  streaks: { longestStreak: number }[],
): number {
  if (streaks.length === 0) {
    return 0;
  }

  return Math.max(...streaks.map((s) => s.longestStreak));
}

/**
 * Total completed habits
 */
export function calculateCompletedHabits(completions: unknown[]): number {
  return completions.length;
}

/**
 * Active habits
 */
export function calculateActiveHabits(
  habits: { isArchived?: boolean }[],
): number {
  return habits.filter((habit) => !habit.isArchived).length;
}
