"use client";

import HabitCard from "./HabitCard";

import { useRealtimeHabits } from "@/hooks/useRealtimeHabits";

interface Props {
  habits: any[];
  streaks: Record<string, number>;
  progress: Record<string, number>;
  completion: Record<string, number>;
}

export default function RealtimeHabitList({
  habits: initialHabits,
  streaks,
  progress,
}: Props) {
  const habits = useRealtimeHabits(initialHabits);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          id={habit.id}
          title={habit.title}
          description={habit.description ?? undefined}
          category={habit.category}
          frequency={habit.frequency}
          reminderTime={habit.reminderTime ?? undefined}
          active={habit.active}
          streak={streaks[habit.id] ?? 0}
          completion={progress[habit.id] ?? 0}
        />
      ))}
    </div>
  );
}
