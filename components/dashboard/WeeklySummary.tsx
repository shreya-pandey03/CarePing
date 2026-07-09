import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BadgeCheck, CircleX, Flame, Sparkles } from "lucide-react";

interface WeeklySummaryProps {
  summary?: {
    completed: number;
    missed: number;
    bestStreak: number;
    aiMessage: string;
  };
}

export default function WeeklySummary({
  summary = {
    completed: 0,
    missed: 0,
    bestStreak: 0,
    aiMessage:
      "Keep completing your habits consistently. Your AI coach insights will appear here in Week 3.",
  },
}: WeeklySummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week</CardTitle>

        <CardDescription>Your weekly habit summary.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-green-500" />

              <span className="font-medium">Completed</span>
            </div>

            <p className="text-3xl font-bold">{summary.completed}</p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <CircleX className="h-5 w-5 text-red-500" />

              <span className="font-medium">Missed</span>
            </div>

            <p className="text-3xl font-bold">{summary.missed}</p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />

              <span className="font-medium">Best Streak</span>
            </div>

            <p className="text-3xl font-bold">{summary.bestStreak} Days</p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />

            <h3 className="font-semibold">AI Coach Preview</h3>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {summary.aiMessage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
