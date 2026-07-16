"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapData {
  date: string;
  count: number;
}

interface HeatmapProps {
  values: HeatmapData[];
}

const COLORS = [
  "bg-muted",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-emerald-700 dark:bg-emerald-300",
];

export default function Heatmap({ values }: HeatmapProps) {
  const valueMap = new Map(values.map((item) => [item.date, item.count]));

  const today = new Date();

  const start = new Date(today);
  start.setDate(today.getDate() - 364);

  const days = [];

  for (let i = 0; i < 365; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);

    const iso = current.toISOString().split("T")[0];

    days.push({
      date: iso,
      count: valueMap.get(iso) ?? 0,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Habit Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
            {days.map((day) => {
              const level = Math.min(day.count, 4);

              return (
                <div
                  key={day.date}
                  title={`${day.date} • ${day.count} completed`}
                  className={`h-4 w-4 rounded-sm ${COLORS[level]} transition-transform duration-150 hover:scale-125 cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Less</span>

          {COLORS.map((color, index) => (
            <div key={index} className={`h-3 w-3 rounded-sm ${color}`} />
          ))}

          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
