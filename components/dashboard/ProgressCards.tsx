import { Flame, CalendarCheck, Target, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

interface ProgressCardsProps {
  data?: {
    weeklyCompletion: number;
    longestStreak: number;
    goalProgress: number;
    monthlyConsistency: number;
  };
}

export default function ProgressCards({
  data = {
    weeklyCompletion: 0,
    longestStreak: 0,
    goalProgress: 0,
    monthlyConsistency: 0,
  },
}: ProgressCardsProps) {
  const cards = [
    {
      title: "Weekly Completion",
      value: `${data.weeklyCompletion}%`,
      progress: data.weeklyCompletion,
      icon: CalendarCheck,
      color: "text-green-500",
    },
    {
      title: "Longest Streak",
      value: `${data.longestStreak} Days`,
      progress: Math.min(data.longestStreak, 100),
      icon: Flame,
      color: "text-orange-500",
    },
    {
      title: "Goal Progress",
      value: `${data.goalProgress}%`,
      progress: data.goalProgress,
      icon: Target,
      color: "text-blue-500",
    },
    {
      title: "Monthly Consistency",
      value: `${data.monthlyConsistency}%`,
      progress: data.monthlyConsistency,
      icon: TrendingUp,
      color: "text-violet-500",
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{card.title}</CardTitle>

              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">{card.value}</div>

              <Progress value={card.progress} className="h-2" />

              <p className="text-sm text-muted-foreground">
                Your current {card.title.toLowerCase()}.
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
