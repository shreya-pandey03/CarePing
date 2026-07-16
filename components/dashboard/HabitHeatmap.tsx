"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapValue {
  date: string;
  count: number;
}
interface HabitHeatmapProps {
  values: HeatmapValue[];
}

const LEVELS = [
  "bg-muted",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-emerald-700 dark:bg-emerald-300",
];

export default function HabitHeatmap({ values }: HabitHeatmapProps) {
  const map = new Map(values.map((v) => [v.date, v.count]));

  const today = new Date();

  const start = new Date(today);
  start.setDate(today.getDate() - 364);

  const days = [];

  for (let i = 0; i < 365; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const iso = date.toISOString().split("T")[0];

    const count = map.get(iso) ?? 0;

    days.push({
      date,
      iso,
      count,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
            {days.map((day) => {
              const level = Math.min(day.count, 4);

              return (
                <div
                  key={day.iso}
                  title={`${day.iso} • ${day.count} completions`}
                  className={`h-4 w-4 rounded-sm ${LEVELS[level]} transition-all hover:scale-125 cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>

          {LEVELS.map((color, i) => (
            <div key={i} className={`h-3 w-3 rounded-sm ${color}`} />
          ))}

          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
