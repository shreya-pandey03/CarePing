"use client";

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CorrelationData {
  habit: string;
  completionRate: number;
  consistency: number;
  streak: number; // actual streak in days
}

interface Props {
  data: CorrelationData[];
}

export default function CorrelationChart({ data }: Props) {
  const chartData = data.map((item) => ({
    habit: item.habit,
    completionRate: item.completionRate,
    consistency: item.consistency,

    // Normalize streak to a 0–100 scale.
    // 10+ days = 100%.
    streakStrength: Math.min(item.streak * 10, 100),

    // Keep original value for tooltip if needed later.
    streakDays: item.streak,
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

              <Tooltip
                formatter={(value, name, props) => {
                  const numericValue = Number(value ?? 0);

                  if (name === "Streak Strength") {
                    return [
                      `${numericValue}% (${props.payload.streakDays} days)`,
                      name,
                    ];
                  }

                  return [`${numericValue}%`, name];
                }}
              />

              <Legend />

              <Radar
                name="Completion"
                dataKey="completionRate"
                fillOpacity={0.35}
              />

              <Radar
                name="Consistency"
                dataKey="consistency"
                fillOpacity={0.25}
              />

              <Radar
                name="Streak Strength"
                dataKey="streakStrength"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
