export type RecommendationPriority = "high" | "medium" | "low";

export type RecommendationCategory =
  | "consistency"
  | "streak"
  | "timing"
  | "difficulty"
  | "recovery"
  | "performance";

export interface HabitRecommendation {
  id: string;
  habitId: string;
  habit: string;

  priority: RecommendationPriority;

  category: RecommendationCategory;

  title: string;

  recommendation: string;

  reason: string;

  expectedImpact: string;

  action: string;
}

// export type RecommendationPriority = "low" | "medium" | "high";

export type RecommendationType =
  | "streak"
  | "consistency"
  | "timing"
  | "completion"
  | "habit_health";

export interface HabitRecommendation {
  habitId: string;
  habitTitle: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  message: string;
  action: string;
}
