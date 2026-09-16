import type { Habit, HabitLog, Streak } from "@/drizzle/schema";

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

export function predictStreakRisk(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
): StreakPrediction {
  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const totalCompletions = streak?.totalCompletions ?? 0;

  const habitLogs = logs
    .filter((log) => log.habitId === habit.id)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime(),
    );

  if (habitLogs.length === 0) {
    return {
      habitId: habit.id,
      habitTitle: habit.title,
      currentStreak,
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

  const latestLog = habitLogs[0];

  const daysSinceLastCompletion = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(latestLog.completedAt).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
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

  const now = new Date();

  let recentCompletions = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(now);

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const completedThatDay = habitLogs.some((log) => {
      const completedAt = new Date(log.completedAt);

      return (
        completedAt.getFullYear() === date.getFullYear() &&
        completedAt.getMonth() === date.getMonth() &&
        completedAt.getDate() === date.getDate()
      );
    });

    if (completedThatDay) {
      recentCompletions++;
    }
  }

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