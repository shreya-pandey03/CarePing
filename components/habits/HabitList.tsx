"use client";

import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";

import HabitCard, { HabitCardProps } from "./HabitCard";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

interface HabitListProps {
  habits: HabitCardProps[];

  onComplete: (id: string) => void;

  onDelete: (id: string) => void;
}

export default function HabitList({
  habits,
  onComplete,
  onDelete,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList className="mb-4 h-16 w-16 text-muted-foreground" />

          <h2 className="text-2xl font-semibold">No habits yet</h2>

          <p className="mt-2 max-w-md text-muted-foreground">
            Create your first habit and start building consistency one day at a
            time.
          </p>

          <Button asChild className="mt-8">
            <Link href="/habits/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Habit
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Habits</h2>

          <p className="text-muted-foreground">
            {habits.length} active habit
            {habits.length > 1 ? "s" : ""}
          </p>
        </div>

        <Button asChild>
          <Link href="/habits/create">
            <Plus className="mr-2 h-4 w-4" />
            New Habit
          </Link>
        </Button>
      </div>

      {/* Grid */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            {...habit}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
