"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { AICoachResponse } from "@/lib/ai/types";

interface Props {
  report: AICoachResponse;
}

export default function AICoachCard({
  report,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          🤖 AI Coach
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p>{report.summary}</p>

        <div>
          <h3 className="font-semibold">
            ✅ Wins
          </h3>

          <ul className="list-disc pl-5">
            {report.wins.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">
            📈 Improvements
          </h3>

          <ul className="list-disc pl-5">
            {report.improvements.map(
              (item) => (
                <li key={item}>{item}</li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">
            💡 Recommendations
          </h3>

          <ul className="list-disc pl-5">
            {report.recommendations.map(
              (item) => (
                <li key={item}>{item}</li>
              ),
            )}
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <p className="font-medium">
             Next Goal
          </p>

          <p>{report.nextGoal}</p>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <p>{report.motivation}</p>
        </div>
      </CardContent>
    </Card>
  );
}