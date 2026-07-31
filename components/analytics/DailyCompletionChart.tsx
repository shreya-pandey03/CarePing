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
  data: {
    date: string;
    completionRate: number;
  }[];
}

export default function DailyCompletionChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Completion Trend</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis domain={[0, 100]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="completionRate"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
