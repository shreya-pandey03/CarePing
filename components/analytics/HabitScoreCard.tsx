"use client";

import { Activity, Flame, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { HabitScore } from "@/lib/habit-score/types";

interface Props {
  score: HabitScore;
}

export default function HabitScoreCard({ score }: Props) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Habit Score</CardTitle>

          <Activity className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8">
            <div className="text-center">
              <p className="text-5xl font-bold">{score.score}</p>

              <p className="text-sm text-muted-foreground">/ 100</p>
            </div>
          </div>

          <h3 className="mt-5 text-xl font-semibold">{score.label}</h3>

          <p className="mt-1 text-center text-sm text-muted-foreground">
            Your overall habit consistency score
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Metric
            icon={<Target className="h-4 w-4" />}
            label="Completion"
            value={`${score.completionScore}%`}
          />

          <Metric
            icon={<Activity className="h-4 w-4" />}
            label="Consistency"
            value={`${score.consistencyScore}%`}
          />

          <Metric
            icon={<Flame className="h-4 w-4" />}
            label="Streak"
            value={`${score.streakScore}%`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border p-3 text-center">
      <div className="mb-1 flex justify-center text-muted-foreground">
        {icon}
      </div>

      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
