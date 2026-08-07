export interface AICoachResponse {
  summary: string;

  wins: string[];

  improvements: string[];

  recommendations: string[];

  motivation: string;

  nextGoal: string;
}