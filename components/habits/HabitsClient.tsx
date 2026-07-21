"use client";

import HabitList from "./HabitList";
import { useHabits } from "@/hooks/useHabits";
import type { HabitCardProps } from "./HabitCard";

interface Props {
  habits: Omit<HabitCardProps, "streak" | "completion">[];

  streakMap: Record<
    string,
    {
      currentStreak: number;
      longestStreak: number;
    }
  >;

  completionMap: Record<string, number>;
}

export default function HabitsClient({
  habits,
  streakMap,
  completionMap,
}: Props) {
  const { removeHabit, completeHabit } = useHabits();

  const handleComplete = async (id: string) => {
    console.log("PAGE COMPLETE:", id);

    await completeHabit(id);
  };

  const handleDelete = async (id: string) => {
    console.log("PAGE DELETE:", id);

    await removeHabit(id);
  };

  return (
    <HabitList
      habits={habits}
      streakMap={streakMap}
      completionMap={completionMap}
      onComplete={handleComplete}
      onDelete={handleDelete}
    />
  );
}
