export interface StreakEntry {
  completedAt: Date;
}

export function calculateLongestStreak(entries: StreakEntry[]): number {
  if (entries.length === 0) {
    return 0;
  }

  const dates = entries
    .map((entry) => {
      const date = new Date(entry.completedAt);

      date.setHours(0, 0, 0, 0);

      return date.getTime();
    })
    .sort((a, b) => a - b);

  let longest = 1;
  let current = 1;

  const oneDay = 24 * 60 * 60 * 1000;

  for (let i = 1; i < dates.length; i++) {
    const diff = dates[i] - dates[i - 1];

    if (diff === oneDay) {
      current++;
      longest = Math.max(longest, current);
    } else if (diff > oneDay) {
      current = 1;
    }
  }

  return longest;
}

export function calculateCurrentStreak(entries: StreakEntry[]): number {
  if (entries.length === 0) {
    return 0;
  }

  const dates = entries
    .map((entry) => {
      const date = new Date(entry.completedAt);

      date.setHours(0, 0, 0, 0);

      return date.getTime();
    })
    .sort((a, b) => b - a);

  let streak = 1;

  const oneDay = 24 * 60 * 60 * 1000;

  for (let i = 1; i < dates.length; i++) {
    const diff = dates[i - 1] - dates[i];

    if (diff === oneDay) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
