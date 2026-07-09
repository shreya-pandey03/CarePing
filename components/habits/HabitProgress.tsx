import { Flame, Trophy, CalendarCheck, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

interface HabitProgressProps {
  completedToday: boolean;

  completionRate: number;

  currentStreak: number;

  longestStreak: number;

  targetDays: number;
}

export default function HabitProgress({
  completedToday,
  completionRate,
  currentStreak,
  longestStreak,
  targetDays,
}: HabitProgressProps) {
  const stats = [
    {
      title: "Today's Status",
      value: completedToday ? "Completed" : "Pending",
      icon: CalendarCheck,
      color: completedToday ? "text-green-500" : "text-yellow-500",
    },
    {
      title: "Current Streak",
      value: `${currentStreak} Days`,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      title: "Longest Streak",
      value: `${longestStreak} Days`,
      icon: Trophy,
      color: "text-amber-500",
    },
    {
      title: "Target / Week",
      value: `${targetDays} Days`,
      icon: Target,
      color: "text-blue-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Completion */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Completion</span>

            <span className="text-lg font-bold">{completionRate}%</span>
          </div>

          <Progress value={completionRate} className="h-3" />
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-lg border p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${item.color}`} />

                  <span className="text-sm text-muted-foreground">
                    {item.title}
                  </span>
                </div>

                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
