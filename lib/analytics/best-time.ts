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

function getIndiaHour(date: Date) {
  const formatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  }).format(date);

  return Number(formatted);
}

export function calculateBestTime(
  habitId: string,
  habitTitle: string,
  logs: HabitLog[],
): BestTimeResult {
  const hours = logs
    .filter(
      (log) => log.habitId === habitId && log.completed && log.completedAt,
    )
    .map((log) => getIndiaHour(new Date(log.completedAt)));

  const morning = hours.filter((h) => h >= 5 && h < 12).length;
  const afternoon = hours.filter((h) => h >= 12 && h < 17).length;
  const evening = hours.filter((h) => h >= 17 && h < 21).length;
  const night = hours.filter((h) => h >= 21 || h < 5).length;

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
      ? Number(Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0][0])
      : null;

  return {
    habitId,
    habitTitle: habitTitle.trim(),
    bestTime,
    bestHour,
    morning,
    afternoon,
    evening,
    night,
  };
}
