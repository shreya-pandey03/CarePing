"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Props {
  title: string;
  data: {
    date: string;
    completed: number;
    completionRate: number;
  }[];
}

export default function DailyCompletionChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Completion Trend</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            No completion data available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Completion Trend</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" tick={{ fontSize: 12 }} />

            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />

            <Tooltip formatter={(value) => [`${value}%`, "Completion"]} />

            <Line
              type="monotone"
              dataKey="completionRate"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
