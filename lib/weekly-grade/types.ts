
export type WeeklyGradeValue = "A+" | "A" | "B" | "C" | "D" | "F";

export interface WeeklyGrade {
  grade: WeeklyGradeValue;
  score: number;
  label: string;
  completed: number;
  expected: number;
  completionRate: number;
}
