export type RiskLevel = "low" | "medium" | "high";

export interface HabitRiskInput {
  title: string;
  currentStreak: number;
  completionRate: number;
  missedDays: number;
}

export interface HabitRiskResult {
  title: string;
  risk: RiskLevel;
  score: number;
  reason: string;
}

export function predictHabitRisk(habit: HabitRiskInput): HabitRiskResult {
  let score = 0;

  // -------------------------
  // Completion Rate
  // -------------------------

  if (habit.completionRate < 40) {
    score += 40;
  } else if (habit.completionRate < 70) {
    score += 20;
  }

  // -------------------------
  // Missed Days
  // -------------------------

  if (habit.missedDays >= 3) {
    score += 35;
  } else if (habit.missedDays >= 1) {
    score += 15;
  }

  // -------------------------
  // Current Streak
  // -------------------------

  if (habit.currentStreak <= 2) {
    score += 25;
  } else if (habit.currentStreak >= 21) {
    score -= 10;
  }

  score = Math.max(0, Math.min(score, 100));

  let risk: RiskLevel;

  if (score >= 70) {
    risk = "high";
  } else if (score >= 40) {
    risk = "medium";
  } else {
    risk = "low";
  }

  let reason = "";

  switch (risk) {
    case "high":
      reason =
        "This habit has a high chance of losing its streak. Consider sending a reminder.";
      break;

    case "medium":
      reason =
        "This habit is becoming inconsistent. Encourage the user to stay on track.";
      break;

    default:
      reason = "This habit is progressing consistently.";
  }

  return {
    title: habit.title,
    risk,
    score,
    reason,
  };
}

export function predictMultipleHabitRisks(
  habits: HabitRiskInput[],
): HabitRiskResult[] {
  return habits.map(predictHabitRisk);
}
