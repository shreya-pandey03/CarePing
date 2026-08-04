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

    completionRate: item.completionRate,

    consistency: item.consistency,

    // convert streak into percentage
    streak: Math.min(item.streak * 10, 100),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Performance Comparison</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid />

              <PolarAngleAxis dataKey="habit" />

              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip formatter={(value) => `${value}%`} />

              <Radar
                name="Completion"
                dataKey="completionRate"
                fillOpacity={0.25}
              />

              <Radar
                name="Consistency"
                dataKey="consistency"
                fillOpacity={0.2}
              />

              <Radar
                name="Streak Strength"
                dataKey="streak"
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
