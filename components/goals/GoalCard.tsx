"use client";

import { CheckCircle2, Clock, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { calculateGoalProgress } from "@/lib/goals/goal-progress";

type Goal = {
  id: string;
  title: string;
  description: string | null;
  targetValue: number;
  currentValue: number;
  status: "active" | "completed" | "paused";
  deadline: Date | null;
};

interface Props {
  goal: Goal;
}

export default function GoalCard({ goal }: Props) {
  const progress = calculateGoalProgress(goal.currentValue, goal.targetValue);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {goal.title}
            </CardTitle>

            {goal.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {goal.description}
              </p>
            )}
          </div>

          <Badge
            variant={goal.status === "completed" ? "default" : "secondary"}
          >
            {goal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold">{goal.currentValue}</p>

            <p className="text-sm text-muted-foreground">
              of {goal.targetValue}
            </p>
          </div>

          <p className="text-2xl font-bold">{progress}%</p>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {goal.status === "completed" ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Goal completed
            </span>
          ) : (
            <span>{goal.targetValue - goal.currentValue} remaining</span>
          )}

          {goal.deadline && (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />

              {goal.deadline.toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
