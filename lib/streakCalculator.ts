import { differenceInCalendarDays } from "date-fns";

export interface HabitLog {
  completedAt: Date;
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Sort logs by date (newest first)
 */
function sortLogs(logs: HabitLog[]) {
  return [...logs].sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime(),
  );
}

/**
 * Remove duplicate completions on the same day.
 */
function uniqueDays(logs: HabitLog[]) {
  const map = new Map<string, HabitLog>();

  for (const log of logs) {
    const key = log.completedAt.toISOString().split("T")[0];

    if (!map.has(key)) {
      map.set(key, log);
    }
  }

  return [...map.values()];
}

/**
 * Current streak calculation
 */
export function calculateCurrentStreak(logs: HabitLog[]) {
  if (!logs.length) return 0;

  const uniqueLogs = uniqueDays(sortLogs(logs));

  let streak = 1;

  const today = new Date();

  const newest = uniqueLogs[0];

  const diff = differenceInCalendarDays(today, newest.completedAt);

  /**
   * If last completion was
   * more than yesterday,
   * streak is broken.
   */

  if (diff > 1) {
    return 0;
  }

  for (let i = 0; i < uniqueLogs.length - 1; i++) {
    const current = uniqueLogs[i].completedAt;

    const previous = uniqueLogs[i + 1].completedAt;

    const gap = differenceInCalendarDays(current, previous);

    if (gap === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Longest streak ever achieved.
 */

export function calculateLongestStreak(logs: HabitLog[]) {
  if (!logs.length) return 0;

  const uniqueLogs = uniqueDays(
    [...logs].sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime()),
  );

  let current = 1;

  let longest = 1;

  for (let i = 1; i < uniqueLogs.length; i++) {
    const gap = differenceInCalendarDays(
      uniqueLogs[i].completedAt,
      uniqueLogs[i - 1].completedAt,
    );

    if (gap === 1) {
      current++;

      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Combined helper
 */

export function calculateStreaks(logs: HabitLog[]): StreakResult {
  return {
    currentStreak: calculateCurrentStreak(logs),

    longestStreak: calculateLongestStreak(logs),
  };
}

/**
 * Check whether today's habit
 * has already been completed.
 */

export function hasCompletedToday(logs: HabitLog[]) {
  const today = new Date().toISOString().split("T")[0];

  return logs.some(
    (log) => log.completedAt.toISOString().split("T")[0] === today,
  );
}

/**
 * Completion percentage
 */

export function calculateCompletionRate(completed: number, expected: number) {
  if (expected === 0) return 0;

  return Math.round((completed / expected) * 100);
}
