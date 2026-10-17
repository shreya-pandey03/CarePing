import type { Habit, HabitLog, Streak } from "@/drizzle/schema";
import { differenceInCalendarDays, startOfDay } from "date-fns";

export type StreakPrediction = {
  habitId: string;
  habitTitle: string;
  currentStreak: number;
  
  longestStreak: number;
  totalCompletions: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  predictedBreakDays: number;
  confidence: number;
  recommendation: string;
};

function getCompletedDays(logs: HabitLog[]): Date[] {
  const uniqueDays = new Map<string, Date>();

  for (const log of logs) {
    if (!log.completed) continue;

    const date = startOfDay(new Date(log.completedAt));
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    uniqueDays.set(key, date);
  }

  return [...uniqueDays.values()].sort((a, b) => b.getTime() - a.getTime());
}

function calculateCurrentStreak(completedDays: Date[], now: Date): number {
  if (completedDays.length === 0) return 0;

  const today = startOfDay(now);
  const latestDay = completedDays[0];
  const daysSinceLatest = differenceInCalendarDays(today, latestDay);

  if (daysSinceLatest > 1) return 0;

  let currentStreak = 1;

  for (let i = 0; i < completedDays.length - 1; i++) {
    const difference = differenceInCalendarDays(
      completedDays[i],
      completedDays[i + 1],
    );

    if (difference === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  return currentStreak;
}

export function predictStreakRisk(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
): StreakPrediction {
  const now = new Date();

  const habitLogs = logs
    .filter(
      (log) =>
        log.habitId === habit.id &&
        log.completed &&
        new Date(log.completedAt) <= now,
    )
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  const completedDays = getCompletedDays(habitLogs);
  const currentStreak = calculateCurrentStreak(completedDays, now);
  const longestStreak = Math.max(streak?.longestStreak ?? 0, currentStreak);
  const totalCompletions = streak?.totalCompletions ?? habitLogs.length;

  if (completedDays.length === 0) {
    return {
      habitId: habit.id,
      habitTitle: habit.title,
      currentStreak: 0,
      longestStreak,
      totalCompletions,
      riskScore: 80,
      riskLevel: "high",
      predictedBreakDays: 1,
      confidence: 0.6,
      recommendation:
        "Start completing this habit consistently to build momentum.",
    };
  }

  const daysSinceLastCompletion = differenceInCalendarDays(
    startOfDay(now),
    completedDays[0],
  );

  let riskScore = 0;

  if (daysSinceLastCompletion >= 3) {
    riskScore += 70;
  } else if (daysSinceLastCompletion === 2) {
    riskScore += 45;
  } else if (daysSinceLastCompletion === 1) {
    riskScore += 20;
  }

  if (currentStreak === 0) {
    riskScore += 20;
  } else if (currentStreak >= 14) {
    riskScore -= 15;
  } else if (currentStreak >= 7) {
    riskScore -= 8;
  }

  const sevenDaysAgo = startOfDay(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const recentCompletions = completedDays.filter(
    (date) => date >= sevenDaysAgo && date <= startOfDay(now),
  ).length;

  const recentConsistency = recentCompletions / 7;

  if (recentConsistency < 0.3) {
    riskScore += 25;
  } else if (recentConsistency < 0.5) {
    riskScore += 15;
  } else if (recentConsistency < 0.7) {
    riskScore += 5;
  } else {
    riskScore -= 5;
  }

  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

  const riskLevel =
    riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low";

  const predictedBreakDays =
    riskLevel === "high" ? 1 : riskLevel === "medium" ? 2 : 4;

  const confidence = Math.min(0.95, 0.5 + habitLogs.length * 0.02);

  let recommendation: string;

  if (riskLevel === "high") {
    recommendation =
      "Your habit is at high risk of breaking. Complete it today to protect your streak.";
  } else if (riskLevel === "medium") {
    recommendation =
      "Your consistency is slipping slightly. Try completing this habit today.";
  } else {
    recommendation = "Your streak looks healthy. Keep your current routine.";
  }

  return {
    habitId: habit.id,
    habitTitle: habit.title,
    currentStreak,
    longestStreak,
    totalCompletions,
    riskScore,
    riskLevel,
    predictedBreakDays,
    confidence: Number(confidence.toFixed(2)),
    recommendation,
  };
}
