import { Activity, CheckCircle2, Flame, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  stats: {
    totalHabits: number;
    completedToday: number;
    currentStreak: number;
    activeGoals: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: "Total Habits",
      value: stats.totalHabits,
      icon: Activity,
      description: "Active habits",
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: CheckCircle2,
      description: "Habits completed",
    },
    {
      title: "Current Streak",
      value: stats.currentStreak,
      icon: Flame,
      description: "Days in a row",
    },
    {
      title: "Active Goals",
      value: stats.activeGoals,
      icon: Target,
      description: "Goals in progress",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>

              <p className="mt-1 text-sm text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
