import type { Habit, HabitLog, Streak } from "@/drizzle/schema";

export type StreakPrediction = {
  habitId: string;
  currentStreak: number;
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

  const habitLogs = logs
    .filter((log) => log.habitId === habit.id)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  if (habitLogs.length === 0) {
    return {
      habitId: habit.id,
      currentStreak,
      riskScore: 80,
      riskLevel: "high",
      predictedBreakDays: 1,
      confidence: 0.6,
      recommendation:
        "Start completing this habit consistently to build momentum.",
    };
  }

  const latestLog = habitLogs[0];

  const daysSinceLastCompletion = Math.floor(
    (Date.now() - new Date(latestLog.completedAt).getTime()) /
      (1000 * 60 * 60 * 24),
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
  }

  riskScore = Math.max(0, Math.min(100, riskScore));

  const riskLevel =
    riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low";

  const predictedBreakDays =
    riskLevel === "high" ? 1 : riskLevel === "medium" ? 2 : 4;

  const confidence = Math.min(0.95, 0.5 + habitLogs.length * 0.02);

  const recommendation =
    riskLevel === "high"
      ? "Complete this habit today to protect your streak."
      : riskLevel === "medium"
        ? "You're slightly behind. Try completing this habit today."
        : "Your streak looks healthy. Keep your current routine.";

  return {
    habitId: habit.id,
    currentStreak,
    riskScore,
    riskLevel,
    predictedBreakDays,
    confidence: Number(confidence.toFixed(2)),
    recommendation,
  };
}
