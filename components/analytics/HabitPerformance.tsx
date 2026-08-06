"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: {
    habitId: string;
    title: string;
    totalCompleted: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    lastCompleted: Date | null;
  }[];
}

export default function HabitPerformance({ data }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {data.map((habit) => (
        <Card key={habit.habitId}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{habit.title}</span>

              <span className="text-sm font-medium">
                {habit.completionRate}%
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Completion Progress */}

            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-primary"
                  style={{
                    width: `${habit.completionRate}%`,
                  }}
                />
              </div>
            </div>

            {/* Stats */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>

                <p className="text-xl font-bold">{habit.totalCompleted}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>

                <p className="text-xl font-bold">🔥 {habit.currentStreak}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Best Streak</p>
                <p className="text-xl font-bold">🏆 {habit.longestStreak}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last Done</p>

                <p className="font-semibold">
                  {habit.lastCompleted
                    ? new Intl.DateTimeFormat("en-GB").format(
                        new Date(habit.lastCompleted),
                      )
                    : "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
