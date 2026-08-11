import type {
  HabitRecommendation,
  RecommendationCategory,
  RecommendationPriority,
} from "./types";

interface HabitData {
  id: string;
  title: string;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  lastCompleted: Date | null;
}

function getPriority(
  completionRate: number,
  currentStreak: number,
): RecommendationPriority {
  if (completionRate < 50 || currentStreak === 0) {
    return "high";
  }

  if (completionRate < 75 || currentStreak < 3) {
    return "medium";
  }

  return "low";
}

function getCategory(
  completionRate: number,
  currentStreak: number,
): RecommendationCategory {
  if (currentStreak === 0) {
    return "recovery";
  }

  if (completionRate < 50) {
    return "consistency";
  }

  if (currentStreak < 3) {
    return "streak";
  }

  if (completionRate >= 90) {
    return "performance";
  }

  return "consistency";
}

export function generateRecommendations(
  habits: HabitData[],
): HabitRecommendation[] {
  const recommendations: HabitRecommendation[] = [];

  for (const habit of habits) {
    const priority = getPriority(habit.completionRate, habit.currentStreak);

    const category = getCategory(habit.completionRate, habit.currentStreak);

    // High-risk / low-consistency habit
    if (habit.completionRate < 50) {
      recommendations.push({
        id: `consistency-${habit.id}`,
        habitId: habit.id,
        habit: habit.title,
        priority,
        category,
        title: `Make ${habit.title} easier to complete`,
        recommendation: `Reduce the difficulty of "${habit.title}" temporarily and focus on consistency.`,
        reason: `Your current completion rate is ${habit.completionRate}%.`,
        expectedImpact:
          "Improved consistency and a lower chance of abandoning the habit.",
        action: "Set a smaller daily target and rebuild your streak.",
      });

      continue;
    }

    // Streak protection
    if (habit.currentStreak > 0 && habit.currentStreak < 3) {
      recommendations.push({
        id: `streak-${habit.id}`,
        habitId: habit.id,
        habit: habit.title,
        priority,
        category,
        title: `Protect your ${habit.title} streak`,
        recommendation: `Focus on completing "${habit.title}" today to build momentum.`,
        reason: `Your current streak is ${habit.currentStreak} days.`,
        expectedImpact:
          "Building a longer streak can improve habit consistency.",
        action: "Complete this habit at your usual routine time today.",
      });

      continue;
    }

    // Strong habit
    if (habit.completionRate >= 90) {
      recommendations.push({
        id: `performance-${habit.id}`,
        habitId: habit.id,
        habit: habit.title,
        priority: "low",
        category: "performance",
        title: `${habit.title} is performing well`,
        recommendation: `Keep your current routine for "${habit.title}" instead of making major changes.`,
        reason: `Your completion rate is ${habit.completionRate}% with a ${habit.currentStreak}-day streak.`,
        expectedImpact:
          "Maintaining the current routine should preserve your consistency.",
        action: "Continue your existing routine.",
      });
    }
  }

  return recommendations;
}
