"use client";

import { eachDayOfInterval, format, subDays } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapData {
  date: string;
  count?: number;
  completionRate: number;
}

interface Props {
  data: HeatmapData[];
}

export default function AdvancedHeatmap({ data }: Props) {
  const today = new Date();

  const days = eachDayOfInterval({
    start: subDays(today, 180),

    end: today,
  });

  const dataMap = new Map(data.map((item) => [item.date, item]));

  const getLevel = (completionRate: number) => {
    if (completionRate === 0) return "bg-muted";

    if (completionRate < 25) return "bg-green-200";

    if (completionRate < 50) return "bg-green-400";

    if (completionRate < 75) return "bg-green-600";

    return "bg-green-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Habit Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-1">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");

            const activity = dataMap.get(key);

            return (
              <div
                key={key}
                className={`
                    h-4
                    w-4
                    rounded-sm
                    ${getLevel(activity?.completionRate ?? 0)}
                  `}
                title={
                  activity
                    ? `${format(day, "dd MMM yyyy")}
                      ${activity.count ?? 0} habits completed
                      ${activity.completionRate}% completion`
                    : `${format(day, "dd MMM yyyy")}
                        No activity`
                }
              />
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Less</span>

          <div className="h-4 w-4 rounded-sm bg-muted" />

          <div className="h-4 w-4 rounded-sm bg-green-200" />

          <div className="h-4 w-4 rounded-sm bg-green-400" />

          <div className="h-4 w-4 rounded-sm bg-green-600" />

          <div className="h-4 w-4 rounded-sm bg-green-800" />

          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
