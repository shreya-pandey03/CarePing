"use client";

import { Activity, CalendarCheck, Flame, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  completionRate: number;
}

export default function DashboardStats({
  totalHabits,
  completedToday,
  currentStreak,
  completionRate,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Habits",
      value: totalHabits,
      icon: Target,
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: CalendarCheck,
    },
    {
      title: "Current Streak",
      value: `${currentStreak} Days`,
      icon: Flame,
    },
    {
      title: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      icon: Activity,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-orange-500" />
            </CardHeader>

            <CardContent>
              <h2 className="text-3xl font-bold">{stat.value}</h2>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
