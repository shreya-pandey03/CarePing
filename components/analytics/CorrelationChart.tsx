"use client";

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CorrelationData {
  habit: string;
  completionRate: number;
  consistency: number;
  streak: number;
}

interface Props {
  data: CorrelationData[];
}

export default function CorrelationChart({ data }: Props) {
  const chartData = data.map((item) => ({
    habit: item.habit,

    completionRate: Math.min(Math.max(item.completionRate, 0), 100),

    consistency: Math.min(Math.max(item.consistency, 0), 100),

    // Streak is already expected to be a 0–100 score.
    streak: Math.min(Math.max(item.streak, 0), 100),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Performance Comparison</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[450px] w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No habit performance data available.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="70%">
                <PolarGrid />

                <PolarAngleAxis
                  dataKey="habit"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tickCount={5}
                  tickFormatter={(value) => `${value}%`}
                />

                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(0)}%`,
                    name,
                  ]}
                />

                <Radar
                  name="Completion"
                  dataKey="completionRate"
                  strokeWidth={2}
                  fillOpacity={0.25}
                />

                <Radar
                  name="Consistency"
                  dataKey="consistency"
                  strokeWidth={2}
                  fillOpacity={0.2}
                />

                <Radar
                  name="Streak Strength"
                  dataKey="streak"
                  strokeWidth={2}
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
