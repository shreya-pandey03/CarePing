"use client";

import { Activity, CheckCircle2, Flame } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { HabitScore as HabitScoreData } from "@/lib/analytics/habit-score";

interface HabitScoreProps {
  data: HabitScoreData;
}

export default function HabitScore({ data }: HabitScoreProps) {
  const getStatusDescription = () => {
    switch (data.status) {
      case "Excellent":
        return "Excellent habit consistency. Keep protecting your progress.";

      case "Good":
        return "You're building strong habits. Stay consistent.";

      case "Fair":
        return "Your habits are progressing. Focus on consistency.";

      case "Needs Attention":
        return "Your habits need attention. Start with small daily actions.";

      default:
        return "Keep working on your habits.";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Habit Score</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score */}

        <div className="flex flex-col items-center text-center">
          <div className="flex items-baseline">
            <span className="text-6xl font-bold tracking-tight">
              {data.score}
            </span>

            <span className="ml-2 text-xl text-muted-foreground">/ 100</span>
          </div>

          <span className="mt-2 rounded-full bg-muted px-4 py-1 text-sm font-medium">
            {data.status}
          </span>

          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            {getStatusDescription()}
          </p>
        </div>

        {/* Score Breakdown */}

        <div className="grid grid-cols-3 gap-3">
          <ScoreItem
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Completion"
            value={data.completionScore}
          />

          <ScoreItem
            icon={<Activity className="h-4 w-4" />}
            label="Consistency"
            value={data.consistencyScore}
          />

          <ScoreItem
            icon={<Flame className="h-4 w-4" />}
            label="Streak"
            value={data.streakScore}
          />
        </div>

        {/* Progress */}

        <div className="space-y-3">
          <ScoreBar label="Completion" value={data.completionScore} />

          <ScoreBar label="Consistency" value={data.consistencyScore} />

          <ScoreBar label="Streak" value={data.streakScore} />
        </div>
      </CardContent>
    </Card>
  );
}

interface ScoreItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function ScoreItem({ icon, label, value }: ScoreItemProps) {
  return (
    <div className="rounded-xl border p-3 text-center">
      <div className="mb-2 flex justify-center text-muted-foreground">
        {icon}
      </div>

      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-lg font-bold">{value}%</p>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  value: number;
}

function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>

        <span className="font-medium">{value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
          }}
        />
      </div>
    </div>
  );
}
