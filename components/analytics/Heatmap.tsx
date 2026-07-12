"use client";

import HeatMap from "@uiw/react-heat-map";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapData {
  date: string;
  count: number;
}

interface HeatmapProps {
  values: HeatmapData[];
}

export default function Heatmap({ values }: HeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Habit Activity</CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <HeatMap
            value={values}
            width={1000}
            rectSize={18}
            space={4}
            startDate={new Date(new Date().getFullYear(), 0, 1)}
            legendCellSize={0}
            panelColors={{
              0: "#161b22",
              1: "#0e4429",
              2: "#006d32",
              3: "#26a641",
              4: "#39d353",
            }}
            rectRender={(props, data) => (
              <rect {...props}>
                <title>
                  {data.date}: {data.count} completed
                </title>
              </rect>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
