import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HeatmapDay {
  date: string;
  count: number;
}

interface HabitHeatmapProps {
  data?: HeatmapDay[];
}

const generatePlaceholderData = (): HeatmapDay[] => {
  return Array.from({ length: 140 }, (_, index) => ({
    date: `Day-${index + 1}`,
    count: 0,
  }));
};

function getHeatColor(count: number) {
  if (count === 0) return "bg-muted border";

  if (count === 1) return "bg-green-200";

  if (count === 2) return "bg-green-300";

  if (count === 3) return "bg-green-500";

  return "bg-green-700";
}

export default function HabitHeatmap({
  data = generatePlaceholderData(),
}: HabitHeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Activity</CardTitle>

        <CardDescription>Your daily habit completion history.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
            {data.map((day) => (
              <div
                key={day.date}
                title={`${day.date} (${day.count})`}
                className={`h-4 w-4 rounded-sm transition-all hover:scale-110 ${getHeatColor(
                  day.count,
                )}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="h-3 w-3 rounded bg-muted border" />
          <div className="h-3 w-3 rounded bg-green-200" />
          <div className="h-3 w-3 rounded bg-green-300" />
          <div className="h-3 w-3 rounded bg-green-500" />
          <div className="h-3 w-3 rounded bg-green-700" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
