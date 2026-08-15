"use client";

import { AlertTriangle, CheckCircle2, Flame } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StreakPrediction as Prediction } from "@/lib/analytics/streak-prediction";

interface StreakPredictionProps {
  predictions: Prediction[];
}

export default function StreakPrediction({
  predictions,
}: StreakPredictionProps) {
  const getBadge = (risk: Prediction["riskLevel"]) => {
    switch (risk) {
      case "low":
        return <Badge>Low Risk</Badge>;

      case "medium":
        return <Badge>Medium Risk</Badge>;

      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
    }
  };

  const getIcon = (risk: Prediction["riskLevel"]) => {
    switch (risk) {
      case "low":
        return <CheckCircle2 className="h-5 w-5" />;

      case "medium":
        return <Flame className="h-5 w-5" />;

      case "high":
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Streak Prediction</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {predictions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No predictions available.
          </p>
        ) : (
          predictions.map((prediction) => (
            <div
              key={prediction.habitId}
              className="space-y-4 rounded-xl border p-4"
            >
              {/* Habit + Risk */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  {getIcon(prediction.riskLevel)}

                  <h3 className="truncate font-semibold">
                    {prediction.habitTitle}
                  </h3>
                </div>

                {getBadge(prediction.riskLevel)}
              </div>

              {/* Risk Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Score</span>

                  <span className="font-semibold">{prediction.riskScore}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        Math.max(prediction.riskScore, 0),
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Recommendation */}
              <p className="text-sm text-muted-foreground">
                {prediction.recommendation}
              </p>

              {/* Prediction Details */}
              <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Predicted Break
                  </p>

                  <p className="text-sm font-medium">
                    {prediction.predictedBreakDays} day
                    {prediction.predictedBreakDays !== 1 ? "s" : ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>

                  <p className="text-sm font-medium">
                    {Math.round(prediction.confidence * 100)}%
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
