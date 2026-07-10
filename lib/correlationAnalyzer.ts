export interface HabitCorrelationInput {
  title: string;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
}

export interface HabitCorrelationResult {
  title: string;
  score: number;
  strength: "weak" | "moderate" | "strong";
  insight: string;
}

export function analyzeHabitCorrelation(
  habit: HabitCorrelationInput,
): HabitCorrelationResult {
  let score = 0;

  // -------------------------
  // Completion Rate
  // -------------------------

  score += habit.completionRate * 0.5;

  // -------------------------
  // Current Streak
  // -------------------------

  score += Math.min(habit.currentStreak, 30);

  // -------------------------
  // Longest Streak
  // -------------------------

  score += Math.min(habit.longestStreak, 20);

  // -------------------------
  // Completed Days
  // -------------------------

  score += Math.min(habit.completedDays / 2, 20);

  score = Math.min(100, Math.round(score));

  let strength: HabitCorrelationResult["strength"];

  if (score >= 80) {
    strength = "strong";
  } else if (score >= 50) {
    strength = "moderate";
  } else {
    strength = "weak";
  }

  let insight = "";

  switch (strength) {
    case "strong":
      insight =
        "This habit shows excellent consistency and positively contributes to your overall routine.";
      break;

    case "moderate":
      insight =
        "This habit is fairly consistent but still has room for improvement.";
      break;

    default:
      insight =
        "This habit is inconsistent. Focus on building a stable routine.";
      break;
  }

  return {
    title: habit.title,
    score,
    strength,
    insight,
  };
}

export function analyzeHabitCorrelations(
  habits: HabitCorrelationInput[],
): HabitCorrelationResult[] {
  return habits.map(analyzeHabitCorrelation);
}
