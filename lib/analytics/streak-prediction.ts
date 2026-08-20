import type { Habit, HabitLog, Streak } from "@/drizzle/schema";

export type StreakPrediction = {
  habitId: string;
  habitTitle: string;
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

  /* Newest completion first.*/
  const habitLogs = logs
    .filter((log) => log.habitId === habit.id)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  /*No completion history.*/
  if (habitLogs.length === 0) {
    return {
      habitId: habit.id,
      habitTitle: habit.title,
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

  /*
   * Days since the last completion.
   */
  const daysSinceLastCompletion = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(latestLog.completedAt).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  let riskScore = 0;

  /** 1. RECENCY RISK*/

  if (daysSinceLastCompletion >= 3) {
    riskScore += 70;
  } else if (daysSinceLastCompletion === 2) {
    riskScore += 45;
  } else if (daysSinceLastCompletion === 1) {
    riskScore += 20;
  } else {
    // Completed today
    riskScore += 0;
  }

  /* 2. CURRENT STREAK*/

  if (currentStreak === 0) {
    riskScore += 20;
  } else if (currentStreak >= 14) {
    riskScore -= 15;
  } else if (currentStreak >= 7) {
    riskScore -= 8;
  }

  /* 3. RECENT CONSISTENCY * Look at the last 7 days.*/

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

  /*
   * Low consistency increases risk.
   */
  if (recentConsistency < 0.3) {
    riskScore += 25;
  } else if (recentConsistency < 0.5) {
    riskScore += 15;
  } else if (recentConsistency < 0.7) {
    riskScore += 5;
  } else {
    riskScore -= 5;
  }

  /*4. CLAMP SCORE*/

  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

  /*5. RISK LEVEL*/

  const riskLevel =
    riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low";

  /** 6. PREDICTED BREAK*/

  const predictedBreakDays =
    riskLevel === "high" ? 1 : riskLevel === "medium" ? 2 : 4;

  /*7.CONFIDENCE More historical data = more confidence.*/

  const confidence = Math.min(0.95, 0.5 + habitLogs.length * 0.02);

  /*8. RECOMMENDATION*/

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

  /*FINAL RESULT*/

  return {
    habitId: habit.id,
    habitTitle: habit.title,
    currentStreak,
    riskScore,
    riskLevel,
    predictedBreakDays,
    confidence: Number(confidence.toFixed(2)),
    recommendation,
  };
}