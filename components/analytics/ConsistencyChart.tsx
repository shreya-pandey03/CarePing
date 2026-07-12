"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConsistencyData {
  label: string;
  consistency: number;
}

interface ConsistencyChartProps {
  data: ConsistencyData[];
}

export default function ConsistencyChart({ data }: ConsistencyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consistency</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="label" />

              <YAxis domain={[0, 100]} unit="%" />

              <Tooltip />

              <Bar dataKey="consistency" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
