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

interface CorrelationChartProps {
  data: CorrelationData[];
}

export default function CorrelationChart({ data }: CorrelationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Performance Comparison</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid />

              <PolarAngleAxis dataKey="habit" />

              <PolarRadiusAxis angle={90} domain={[0, 100]} />

              <Tooltip />

              <Radar
                name="Completion Rate"
                dataKey="completionRate"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.35}
              />

              <Radar
                name="Consistency"
                dataKey="consistency"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.25}
              />

              <Radar
                name="Streak"
                dataKey="streak"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
