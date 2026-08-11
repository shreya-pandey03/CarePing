"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Flame,
  Lightbulb,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { HabitRecommendation } from "@/lib/recommendations/types";

interface Props {
  recommendations: HabitRecommendation[];
}

function priorityStyles(priority: HabitRecommendation["priority"]) {
  switch (priority) {
    case "high":
      return {
        label: "High Priority",
        className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      };

    case "medium":
      return {
        label: "Medium Priority",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      };

    default:
      return {
        label: "Low Priority",
        className:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      };
  }
}

function CategoryIcon({
  category,
}: {
  category: HabitRecommendation["category"];
}) {
  switch (category) {
    case "streak":
      return <Flame className="h-5 w-5" />;

    case "timing":
      return <Clock className="h-5 w-5" />;

    case "recovery":
      return <AlertTriangle className="h-5 w-5" />;

    case "performance":
      return <CheckCircle2 className="h-5 w-5" />;

    default:
      return <Lightbulb className="h-5 w-5" />;
  }
}

export default function RecommendationsList({ recommendations }: Props) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="mb-4 h-10 w-10" />

          <h2 className="text-xl font-semibold">You're doing great!</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            There are no recommendations right now. Keep following your current
            routine.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {recommendations.map((recommendation) => {
        const priority = priorityStyles(recommendation.priority);

        return (
          <Card key={recommendation.id} className="overflow-hidden">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border p-2">
                    <CategoryIcon category={recommendation.category} />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.habit}
                    </p>

                    <h2 className="font-semibold">{recommendation.title}</h2>
                  </div>
                </div>

                <Badge className={priority.className}>{priority.label}</Badge>
              </div>

              <div>
                <p className="text-sm font-medium">Recommendation</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {recommendation.recommendation}
                </p>
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-sm font-medium">Why?</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {recommendation.reason}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Expected Impact
                  </p>

                  <p className="mt-1 text-sm">
                    {recommendation.expectedImpact}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Suggested Action
                  </p>

                  <p className="mt-1 flex items-start gap-1 text-sm">
                    {recommendation.action}

                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
