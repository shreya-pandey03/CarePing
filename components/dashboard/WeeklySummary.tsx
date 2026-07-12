"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Flame, Lightbulb } from "lucide-react";

interface WeeklySummaryProps {
  title: string;
  summary: string;
  completionRate: number;
  bestStreak: number;
  recommendations: string[];
}

export default function WeeklySummary({
  title,
  summary,
  completionRate,
  bestStreak,
  recommendations,
}: WeeklySummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground leading-6">{summary}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Completion Rate</span>
            </div>

            <Badge variant="secondary">{completionRate.toFixed(1)}%</Badge>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Best Streak</span>
            </div>

            <Badge variant="secondary">{bestStreak} Days</Badge>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Recommendations</h3>
          </div>

          <ul className="space-y-2">
            {recommendations.map((item, index) => (
              <li key={index} className="rounded-md border p-3 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
