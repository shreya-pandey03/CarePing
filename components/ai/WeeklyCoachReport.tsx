"use client";

import {
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Target,
  Trophy,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";

interface WeeklyCoachReportProps {
  week: string;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export default function WeeklyCoachReport({
  week,
  score,
  summary,
  strengths,
  improvements,
  recommendations,
}: WeeklyCoachReportProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              Weekly AI Coach Report
            </CardTitle>

            <CardDescription>{week}</CardDescription>
          </div>

          <Badge className="bg-violet-500 hover:bg-violet-600">AI Coach</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Overall Score */}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Weekly Score</span>

            <span className="font-bold text-lg">{score}/100</span>
          </div>

          <Progress value={score} />
        </div>

        {/* Summary */}

        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />

            <h3 className="font-semibold">Summary</h3>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">{summary}</p>
        </div>

        {/* Strengths */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />

            <h3 className="font-semibold">Strengths</h3>
          </div>

          <ul className="space-y-2">
            {strengths.map((item, index) => (
              <li
                key={index}
                className="rounded-lg border border-green-200 p-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-yellow-500" />

            <h3 className="font-semibold">Areas to Improve</h3>
          </div>

          <ul className="space-y-2">
            {improvements.map((item, index) => (
              <li
                key={index}
                className="rounded-lg border border-yellow-200 p-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-500" />

            <h3 className="font-semibold">AI Recommendations</h3>
          </div>

          <ul className="space-y-2">
            {recommendations.map((item, index) => (
              <li key={index} className="rounded-lg border p-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
