"use client";

import { AlertTriangle, CheckCircle2, Clock, Flame } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { HabitRecommendation } from "@/lib/recommendations/types";

interface Props {
  recommendation: HabitRecommendation;
}

const icons = {
  streak: Flame,
  consistency: AlertTriangle,
  timing: Clock,
  completion: CheckCircle2,
  habit_health: CheckCircle2,
};

export default function RecommendationCard({ recommendation }: Props) {
  const Icon = icons[recommendation.type];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />

            <div>
              <CardTitle className="text-base">
                {recommendation.title}
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                {recommendation.habitTitle}
              </p>
            </div>
          </div>

          <Badge
            variant={
              recommendation.priority === "high" ? "destructive" : "secondary"
            }
          >
            {recommendation.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {recommendation.message}
        </p>

        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-sm font-medium">Recommended action</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {recommendation.action}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
