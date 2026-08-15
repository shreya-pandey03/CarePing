export type HabitScore = {
  score: number;
  label: "Excellent" | "Good" | "Fair" | "Needs Attention";
  completionScore: number;
  consistencyScore: number;
  streakScore: number;
  recoveryScore: number;
};