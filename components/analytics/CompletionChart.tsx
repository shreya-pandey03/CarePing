"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompletionData {
  date: string;
  completionRate: number;
}

interface CompletionChartProps {
  data: CompletionData[];
}

export default function CompletionChart({ data }: CompletionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Rate</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis domain={[0, 100]} unit="%" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="completionRate"
                stroke="#f97316"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
