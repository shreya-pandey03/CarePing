"use client";

import { Clock3, Moon, Sun, Sunset, Sunrise } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BestTimeResult } from "@/lib/analytics/best-time";

interface Props {
  data: BestTimeResult[];
}

const periodConfig = {
  morning: {
    label: "Morning",
    icon: Sunrise,
  },
  afternoon: {
    label: "Afternoon",
    icon: Sun,
  },
  evening: {
    label: "Evening",
    icon: Sunset,
  },
  night: {
    label: "Night",
    icon: Moon,
  },
} as const;

export default function BestTimeAnalytics({ data }: Props) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock3 className="h-5 w-5" />
            Best Time Analytics
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Complete some habits to discover your best time of day.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock3 className="h-5 w-5" />
          Best Time Analytics
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Discover when you are most consistent.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {data.map((habit) => {
          const config =
            periodConfig[habit.bestTime as keyof typeof periodConfig];

          const Icon = config?.icon ?? Clock3;

          const total =
            habit.morning + habit.afternoon + habit.evening + habit.night;

          return (
            <div key={habit.habitId} className="rounded-xl border p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{habit.habitTitle}</h3>

                  <p className="text-sm text-muted-foreground">
                    Best time to complete
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                  <Icon className="h-4 w-4" />

                  <span className="text-sm font-medium">
                    {config?.label ?? "Unknown"}
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs text-muted-foreground">
                  Most active hour
                </p>

                <p className="text-2xl font-bold">
                  {habit.bestHour === null
                    ? "No data"
                    : formatHour(habit.bestHour)}
                </p>
              </div>

              <div className="space-y-3">
                <TimeBar label="Morning" value={habit.morning} total={total} />

                <TimeBar
                  label="Afternoon"
                  value={habit.afternoon}
                  total={total}
                />

                <TimeBar label="Evening" value={habit.evening} total={total} />

                <TimeBar label="Night" value={habit.night} total={total} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function TimeBar({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${displayHour}:00 ${suffix}`;
}
