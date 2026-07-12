"use client";

import { CalendarDays, CalendarRange, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressCardsProps {
  dailyProgress: number;
  weeklyProgress: number;
  monthlyProgress: number;
}

export default function ProgressCards({
  dailyProgress,
  weeklyProgress,
  monthlyProgress,
}: ProgressCardsProps) {
  const cards = [
    {
      title: "Today's Progress",
      value: dailyProgress,
      icon: CalendarDays,
    },
    {
      title: "Weekly Progress",
      value: weeklyProgress,
      icon: CalendarRange,
    },
    {
      title: "Monthly Progress",
      value: monthlyProgress,
      icon: Calendar,
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{card.title}</CardTitle>

              <Icon className="h-5 w-5 text-orange-500" />
            </CardHeader>

            <CardContent className="space-y-4">
              <Progress value={card.value} />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>

                <span className="font-semibold">{card.value.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
