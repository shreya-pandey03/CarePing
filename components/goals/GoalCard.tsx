"use client";

import { CheckCircle2, Clock, Target, Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateGoalProgress } from "@/lib/goals/goal-progress";

type Goal = {
  id: string;
  title: string;
  description: string | null;

  // Connected habit
  habitId: string | null;
  habitTitle: string | null;

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

  const remaining = Math.max(goal.targetValue - goal.currentValue, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {goal.title}
            </CardTitle>

            {goal.description && (
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            )}

            {/* Connected Habit */}
            {goal.habitTitle && (
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />

                <span className="text-muted-foreground">Habit:</span>

                <span className="font-medium">{goal.habitTitle}</span>
              </div>
            )}
          </div>

          <Badge
            variant={
              goal.status === "completed"
                ? "default"
                : goal.status === "paused"
                  ? "outline"
                  : "secondary"
            }
          >
            {goal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Progress numbers */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold">{goal.currentValue}</p>

            <p className="text-sm text-muted-foreground">
              of {goal.targetValue}
            </p>
          </div>

          <p className="text-2xl font-bold">{progress}%</p>
        </div>

        {/* Progress bar */}
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Progress status */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {goal.status === "completed" ? (
            <span className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Goal completed
            </span>
          ) : (
            <span>{remaining} remaining</span>
          )}

          {/* Deadline */}
          {goal.deadline && (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />

              {goal.deadline.toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Habit → Goal explanation */}
        {goal.habitTitle && (
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">
              Goal progress is updated when you complete:
            </p>

            <p className="mt-1 font-medium">{goal.habitTitle}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
