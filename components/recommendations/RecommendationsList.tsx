"use client";

import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import RecommendationCard from "./RecommendationCard";

import type { HabitRecommendation } from "@/lib/recommendations/types";

interface Props {
  recommendations: HabitRecommendation[];
}

export default function RecommendationList({ recommendations }: Props) {
  if (!recommendations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Keep completing your habits to receive personalized recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation, index) => (
        <RecommendationCard
          key={`${recommendation.habitId}-${recommendation.type}-${index}`}
          recommendation={recommendation}
        />
      ))}
    </div>
  );
}
