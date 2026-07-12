"use client";

import HeatMap from "@uiw/react-heat-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapValue {
  date: string;
  count: number;
}

interface HabitHeatmapProps {
  values: HeatmapValue[];
}

export default function HabitHeatmap({ values }: HabitHeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Activity</CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <HeatMap
          value={values}
          width={900}
          rectSize={16}
          space={4}
          startDate={new Date(new Date().getFullYear(), 0, 1)}
        />
      </CardContent>
    </Card>
  );
}
