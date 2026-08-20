"use client";

import { AlertTriangle, CheckCircle2, Flame } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import type { StreakPrediction as StreakPredictionData } from "@/lib/analytics/streak-prediction";

interface StreakPredictionProps {
  predictions: StreakPredictionData[];
}

export default function StreakPrediction({
  predictions,
}: StreakPredictionProps) {
  const getBadge = (risk: StreakPredictionData["riskLevel"]) => {
    switch (risk) {
      case "low":
        return <Badge>Low Risk</Badge>;

      case "medium":
        return <Badge>Medium Risk</Badge>;

      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
    }
  };

  const getIcon = (risk: StreakPredictionData["riskLevel"]) => {
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(prediction.riskLevel)}

                  <h3 className="font-semibold">{prediction.habitTitle}</h3>
                </div>

                {getBadge(prediction.riskLevel)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Score</span>

                  <span className="font-semibold">{prediction.riskScore}%</span>
                </div>

                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${prediction.riskScore}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current streak: {prediction.currentStreak} days</span>

                  <span>
                    Confidence: {Math.round(prediction.confidence * 100)}%
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {prediction.recommendation}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
