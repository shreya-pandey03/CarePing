import type { WeeklyGrade } from "./types";

interface WeeklyGradeInput {
  completed: number;
  expected: number;
}


export function calculateWeeklyGrade({
  completed,
  expected,
}: WeeklyGradeInput): WeeklyGrade {
  if (expected <= 0) {
    return {
      grade: "F",
      score: 0,
      label: "No activity",
      completed: 0,
      expected: 0,
      completionRate: 0,
    };
  }

  const completionRate = Math.min(
    100,
    Math.round((completed / expected) * 100),
  );

  let grade: WeeklyGrade["grade"];
  let label: string;

  if (completionRate >= 95) {
    grade = "A+";
    label = "Outstanding week";
  } else if (completionRate >= 90) {
    grade = "A";
    label = "Excellent week";
  } else if (completionRate >= 80) {
    grade = "B";
    label = "Great progress";
  } else if (completionRate >= 70) {
    grade = "C";
    label = "Good effort";
  } else if (completionRate >= 50) {
    grade = "D";
    label = "Needs improvement";
  } else {
    grade = "F";
    label = "Let's rebuild your routine";
  }

  return {
    grade,
    score: completionRate,
    label,
    completed,
    expected,
    completionRate,
  };
}
