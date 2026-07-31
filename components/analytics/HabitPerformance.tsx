import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: {
    habitId: string;
    title: string;
    totalCompleted: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    lastCompleted: Date | null;
  }[];
}

export default function HabitPerformance({ data }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {data.map((habit) => (
        <Card key={habit.habitId}>
          <CardHeader>
            <CardTitle>{habit.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>

              <div className="text-2xl font-bold">{habit.completionRate}%</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>

                <p className="font-semibold">
                  {habit.totalCompleted}
                  times
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>

                <p className="font-semibold">🔥 {habit.currentStreak}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Longest</p>

                <p className="font-semibold">🏆 {habit.longestStreak}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last Done</p>

                <p className="font-semibold">
                  {habit.lastCompleted
                    ? habit.lastCompleted.toLocaleDateString()
                    : "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
