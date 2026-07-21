"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Flame,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface HabitCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  streak: number;
  completion: number;
  reminderTime?: string;
  active: boolean;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function HabitCard({
  id,
  title,
  description,
  category,
  frequency,
  reminderTime,
  active,
  streak,
  completion,
  onComplete,
  onDelete,
}: HabitCardProps) {
  return (
    <Card className={!active ? "opacity-60" : ""}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>

            {description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          <Badge>{category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Frequency */}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />

          {frequency}
        </div>

        {/* Reminder */}

        {reminderTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" />

            {reminderTime}
          </div>
        )}

        {/* Streak */}

        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />

          <span className="font-medium">{streak} day streak</span>
        </div>

        {/* Completion */}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion</span>

            <span>{completion}%</span>
          </div>

          <Progress value={completion} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            console.log("Complete clicked", id);
            onComplete?.(id);
          }}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Complete
        </Button>

        <Button variant="outline">
          <Link href={`/habits/${id}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            console.log("Delete clicked", id);
            onDelete?.(id);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
