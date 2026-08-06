"use client";

import { Activity, CheckCircle2, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

interface HabitHealth {
  habitId: string;

  title: string;

  score: number;

  status: "Excellent" | "Good" | "Needs Attention";

  completionRate: number;

  currentStreak: number;

  completedToday: boolean;
}

interface Props {
  data: HabitHealth[];
}

export default function HabitHealth({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>❤️ Habit Health</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {data.map((habit) => (
          <div key={habit.habitId} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{habit.title}</h3>

                <p className="text-sm text-muted-foreground">{habit.status}</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold">{habit.score}</div>

                <div className="text-xs text-muted-foreground">/100</div>
              </div>
            </div>

            <Progress className="mt-4" value={habit.score} />

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <Activity className="mx-auto mb-2 h-5 w-5" />

                <p className="text-xs text-muted-foreground">Completion</p>

                <p className="font-semibold">{habit.completionRate}%</p>
              </div>

              <div>
                <AlertTriangle className="mx-auto mb-2 h-5 w-5" />

                <p className="text-xs text-muted-foreground">Streak</p>

                <p className="font-semibold">🔥 {habit.currentStreak}</p>
              </div>

              <div>
                <CheckCircle2 className="mx-auto mb-2 h-5 w-5" />

                <p className="text-xs text-muted-foreground">Today</p>

                <p className="font-semibold">
                  {habit.completedToday ? "Done" : "Pending"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
