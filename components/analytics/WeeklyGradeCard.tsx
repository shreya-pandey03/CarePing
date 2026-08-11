"use client";

import {
  Award,
  CheckCircle2,
  Target,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { WeeklyGrade } from "@/lib/weekly-grade/types";

interface Props {
  grade: WeeklyGrade;
}

export default function WeeklyGradeCard({
  grade,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weekly Grade</CardTitle>

          <Award className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8">
            <span className="text-4xl font-bold">
              {grade.grade}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              {grade.label}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              You completed{" "}
              <span className="font-medium text-foreground">
                {grade.completed}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {grade.expected}
              </span>{" "}
              scheduled habit completions.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />

              <span className="text-sm">
                Completion
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {grade.completionRate}%
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />

              <span className="text-sm">
                Weekly Score
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {grade.score}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}