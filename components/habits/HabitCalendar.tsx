import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CheckCircle2, Circle } from "lucide-react";

interface HabitDay {
  date: string;
  completed: boolean;
}

interface HabitCalendarProps {
  month: string;
  data?: HabitDay[];
}

function generatePlaceholderData(): HabitDay[] {
  return Array.from({ length: 31 }, (_, index) => ({
    date: `${index + 1}`,
    completed: false,
  }));
}

export default function HabitCalendar({
  month,
  data = generatePlaceholderData(),
}: HabitCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{month}</CardTitle>

        <CardDescription>Monthly habit completion history</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Weekday Header */}

        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar */}

        <div className="grid grid-cols-7 gap-2">
          {data.map((day, index) => (
            <div
              key={`${day.date}-${index}`}
              className="flex aspect-square flex-col items-center justify-center rounded-lg border transition-colors hover:bg-muted"
            >
              <span className="text-sm font-medium">{day.date}</span>

              {day.completed ? (
                <CheckCircle2 className="mt-1 h-4 w-4 text-green-500" />
              ) : (
                <Circle className="mt-1 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Legend */}

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Completed
          </div>

          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-muted-foreground" />
            Not Completed
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
