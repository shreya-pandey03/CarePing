"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

interface Props {
  grade: {
    score: number;
    grade: string;
    averageCompletion: number;
    completedHabits: number;
    totalHabits: number;
    longestStreak: number;
    missedHabits: number;
    feedback: string;
  };
}

export default function WeeklyGrade({ grade }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 Weekly Grade</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-black">{grade.grade}</div>

          <p className="mt-2 text-muted-foreground">Weekly Score</p>

          <div className="mt-1 text-2xl font-bold">{grade.score}/100</div>
        </div>

        <Progress value={grade.score} />

        <div className="grid grid-cols-2 gap-4">
          <Stat title="Completion" value={`${grade.averageCompletion}%`} />

          <Stat
            title="Completed"
            value={`${grade.completedHabits}/${grade.totalHabits}`}
          />

          <Stat title="Best Streak" value={`${grade.longestStreak} 🔥`} />

          <Stat title="Missed" value={grade.missedHabits.toString()} />
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm">{grade.feedback}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <p className="text-xs text-muted-foreground">{title}</p>

      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
