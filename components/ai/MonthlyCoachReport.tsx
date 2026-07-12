"use client";

import { Calendar, Trophy, TrendingUp, Target, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";

interface MonthlyCoachReportProps {
  month: string;
  score: number;
  summary: string;
  completionRate: number;
  longestStreak: number;
  achievements: string[];
  recommendations: string[];
}

export default function MonthlyCoachReport({
  month,
  score,
  summary,
  completionRate,
  longestStreak,
  achievements,
  recommendations,
}: MonthlyCoachReportProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Monthly AI Coach Report
            </CardTitle>

            <CardDescription>{month}</CardDescription>
          </div>

          <Badge className="bg-blue-500 hover:bg-blue-600">Monthly</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Score */}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Monthly Score</span>

            <span className="text-xl font-bold">{score}/100</span>
          </div>

          <Progress value={score} />
        </div>

        {/* Summary */}

        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />

            <h3 className="font-semibold">AI Summary</h3>
          </div>

          <p className="leading-7 text-muted-foreground">{summary}</p>
        </div>

        {/* Statistics */}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />

              <span className="font-medium">Completion Rate</span>
            </div>

            <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />

              <span className="font-medium">Longest Streak</span>
            </div>

            <p className="text-2xl font-bold">{longestStreak} Days</p>
          </div>
        </div>

        {/* Achievements */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />

            <h3 className="font-semibold">Achievements</h3>
          </div>

          <ul className="space-y-2">
            {achievements.map((achievement, index) => (
              <li
                key={index}
                className="rounded-lg border border-yellow-200 p-3"
              >
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />

            <h3 className="font-semibold">AI Recommendations</h3>
          </div>

          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="rounded-lg border p-3">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
