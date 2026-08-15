import type { InferSelectModel } from "drizzle-orm";
import { habitLogs } from "@/drizzle/schema";

type HabitLog = InferSelectModel<typeof habitLogs>;

export type BestTimePeriod = "morning" | "afternoon" | "evening" | "night";

export type BestTimeResult = {
  habitId: string;
  habitTitle: string;
  bestTime: BestTimePeriod;
  bestHour: number | null;
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
};

export function calculateBestTime(
  habitId: string,
  habitTitle: string,
  logs: HabitLog[],
): BestTimeResult {
  const habitLogs = logs.filter(
    (log) => log.habitId === habitId && log.completed,
  );

  const periods = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };

  const hours: number[] = [];

  for (const log of habitLogs) {
    const date = new Date(log.completedAt);
    const hour = date.getHours();

    hours.push(hour);

    if (hour >= 5 && hour < 12) {
      periods.morning++;
    } else if (hour >= 12 && hour < 17) {
      periods.afternoon++;
    } else if (hour >= 17 && hour < 21) {
      periods.evening++;
    } else {
      periods.night++;
    }
  }

  const bestTime = (
    Object.entries(periods) as [BestTimePeriod, number][]
  ).reduce((best, current) => (current[1] > best[1] ? current : best), [
    "morning",
    0,
  ] as [BestTimePeriod, number])[0];

  const hourCounts = new Map<number, number>();

  for (const hour of hours) {
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
  }

  let bestHour: number | null = null;
  let maxCount = 0;

  for (const [hour, count] of hourCounts) {
    if (count > maxCount) {
      maxCount = count;
      bestHour = hour;
    }
  }

  return {
    habitId,
    habitTitle,
    bestTime,
    bestHour,
    morning: periods.morning,
    afternoon: periods.afternoon,
    evening: periods.evening,
    night: periods.night,
  };
}
