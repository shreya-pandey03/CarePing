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
