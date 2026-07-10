export interface Recommendation {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

interface Habit {
  title: string;
  targetDays: number;
}

interface Streak {
  currentStreak: number;
  longestStreak: number;
}

interface Analytics {
  completionRate: number;
}

interface RecommendationInput {
  habits: Habit[];
  streaks: Streak[];
  analytics: Analytics;
}

export function generateRecommendations(
  input: RecommendationInput,
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // -------------------------
  // Low completion rate
  // -------------------------

  if (input.analytics.completionRate < 50) {
    recommendations.push({
      title: "Improve Consistency",
      description:
        "Your completion rate is below 50%. Try reducing the number of habits or lowering your daily target.",
      priority: "high",
    });
  }

  // -------------------------
  // Broken streaks
  // -------------------------

  input.streaks.forEach((streak) => {
    if (streak.currentStreak === 0) {
      recommendations.push({
        title: "Restart Your Streak",
        description:
          "Complete one habit today to begin building momentum again.",
        priority: "high",
      });
    }
  });

  // -------------------------
  // Long streak reward
  // -------------------------

  input.streaks.forEach((streak) => {
    if (streak.currentStreak >= 30) {
      recommendations.push({
        title: "Excellent Progress!",
        description:
          "You've maintained a 30+ day streak. Consider increasing your goal or adding a new habit.",
        priority: "low",
      });
    }
  });

  // -------------------------
  // Too many habits
  // -------------------------

  if (input.habits.length > 10) {
    recommendations.push({
      title: "Reduce Habit Load",
      description:
        "Managing many habits can reduce consistency. Focus on your most important goals first.",
      priority: "medium",
    });
  }

  // -------------------------
  // Daily habits reminder
  // -------------------------

  input.habits.forEach((habit) => {
    if (habit.targetDays === 7) {
      recommendations.push({
        title: `${habit.title}`,
        description:
          "Daily habits work best when completed at the same time each day.",
        priority: "low",
      });
    }
  });

  return recommendations;
}
