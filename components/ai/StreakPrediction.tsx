"use client";

import { AlertTriangle, CheckCircle2, Flame } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

interface Prediction {
  habit: string;
  risk: "low" | "medium" | "high";
  score: number;
  recommendation: string;
}

interface StreakPredictionProps {
  predictions: Prediction[];
}

export default function StreakPrediction({
  predictions,
}: StreakPredictionProps) {
  const getBadge = (risk: Prediction["risk"]) => {
    switch (risk) {
      case "low":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Low Risk</Badge>
        );

      case "medium":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            Medium Risk
          </Badge>
        );

      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
    }
  };

  const getIcon = (risk: Prediction["risk"]) => {
    switch (risk) {
      case "low":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;

      case "medium":
        return <Flame className="h-5 w-5 text-yellow-500" />;

      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
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
            <div key={prediction.habit} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(prediction.risk)}

                  <h3 className="font-semibold">{prediction.habit}</h3>
                </div>

                {getBadge(prediction.risk)}
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Risk Score:</span>{" "}
                  {prediction.score}/100
                </p>

                <p className="text-muted-foreground">
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
