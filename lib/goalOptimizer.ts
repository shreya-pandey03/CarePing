export interface GoalInput {
  title: string;
  currentTargetDays: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

export interface GoalSuggestion {
  title: string;
  currentTargetDays: number;
  suggestedTargetDays: number;
  reason: string;
  confidence: number;
}

export function optimizeGoal(goal: GoalInput): GoalSuggestion {
  let suggestedTargetDays = goal.currentTargetDays;
  let reason = "Your current goal is well balanced.";
  let confidence = 90;

  // ------------------------------------
  // Low completion rate
  // ------------------------------------

  if (goal.completionRate < 40) {
    suggestedTargetDays = Math.max(1, goal.currentTargetDays - 2);

    reason =
      "Your completion rate is low. Consider reducing your weekly target to build consistency.";

    confidence = 95;
  }

  // ------------------------------------
  // Medium completion rate
  // ------------------------------------
  else if (goal.completionRate < 70) {
    suggestedTargetDays = Math.max(1, goal.currentTargetDays - 1);

    reason = "A slightly smaller goal may help you maintain a better streak.";

    confidence = 85;
  }

  // ------------------------------------
  // Excellent consistency
  // ------------------------------------
  else if (goal.completionRate >= 95 && goal.currentStreak >= 30) {
    suggestedTargetDays = Math.min(7, goal.currentTargetDays + 1);

    reason =
      "You're consistently achieving your goal. You may be ready to increase the challenge.";

    confidence = 80;
  }

  // ------------------------------------
  // Long streak reward
  // ------------------------------------

  if (goal.longestStreak >= 100 && goal.completionRate >= 90) {
    reason += " Your long-term consistency shows strong habit formation.";
  }

  return {
    title: goal.title,
    currentTargetDays: goal.currentTargetDays,
    suggestedTargetDays,
    reason,
    confidence,
  };
}

export function optimizeGoals(goals: GoalInput[]): GoalSuggestion[] {
  return goals.map(optimizeGoal);
}
