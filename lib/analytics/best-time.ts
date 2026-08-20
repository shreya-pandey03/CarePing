import type { InferSelectModel } from "drizzle-orm";
import { habitLogs } from "@/drizzle/schema";

type HabitLog = InferSelectModel<typeof habitLogs>;

export type BestTimeResult = {
  habitId: string;
  habitTitle: string;
  bestTime: "morning" | "afternoon" | "evening" | "night";
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
  const completedLogs = logs.filter(
    (log) => log.habitId === habitId && log.completed,
  );

  const hours = completedLogs
    .map((log) => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false,
      }).formatToParts(new Date(log.completedAt));

      const hour = parts.find((part) => part.type === "hour")?.value;

      return hour ? Number(hour) : null;
    })
    .filter((hour): hour is number => hour !== null);

  const morning = hours.filter((hour) => hour >= 5 && hour < 12).length;
  const afternoon = hours.filter((hour) => hour >= 12 && hour < 17).length;
  const evening = hours.filter((hour) => hour >= 17 && hour < 21).length;
  const night = hours.filter((hour) => hour >= 21 || hour < 5).length;

  const periods = {
    morning,
    afternoon,
    evening,
    night,
  };

  const bestTime =
    (Object.entries(periods).sort(
      ([, a], [, b]) => b - a,
    )[0]?.[0] as BestTimeResult["bestTime"]) ?? "morning";

  const hourCounts = hours.reduce<Record<number, number>>((acc, hour) => {
    acc[hour] = (acc[hour] ?? 0) + 1;
    return acc;
  }, {});

  const bestHour =
    hours.length > 0
      ? Number(
          Object.entries(hourCounts).sort(
            ([hourA, countA], [hourB, countB]) =>
              countB - countA || Number(hourA) - Number(hourB),
          )[0]?.[0],
        )
      : null;

  return {
    habitId,
    habitTitle,
    bestTime,
    bestHour,
    morning,
    afternoon,
    evening,
    night,
  };
}
