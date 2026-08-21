"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { createGoal } from "@/actions/goals/createGoal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Habit = {
  id: string;
  title: string;
};

interface Props {
  habits: Habit[];
}

export default function CreateGoalForm({ habits }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [habitId, setHabitId] = useState("");

  const [targetValue, setTargetValue] = useState("30");

  const [deadline, setDeadline] = useState("");

  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a goal title.");
      return;
    }

    if (!habitId) {
      setError("Please select a habit.");
      return;
    }

    startTransition(async () => {
      try {
        await createGoal({
          title,
          description,
          habitId,
          targetValue: Number(targetValue),
          deadline,
        });

        setTitle("");
        setDescription("");
        setHabitId("");
        setTargetValue("30");
        setDeadline("");

        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to create goal.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Goal title */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Goal title</label>

        <Input
          placeholder="Read 10 books"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />
      </div>

      {/* Description */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>

        <Textarea
          placeholder="What do you want to achieve?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
        />
      </div>

      {/* Habit */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Habit</label>

        <select
          value={habitId}
          onChange={(e) => setHabitId(e.target.value)}
          disabled={isPending}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Select a habit</option>

          {habits.map((habit) => (
            <option key={habit.id} value={habit.id}>
              {habit.title}
            </option>
          ))}
        </select>
      </div>

      {/* Target */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Target value</label>

        <Input
          type="number"
          min="1"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          disabled={isPending}
        />
      </div>

      {/* Deadline */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Deadline</label>

        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={isPending}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isPending || habits.length === 0}>
        {isPending ? "Creating..." : "Create Goal"}
      </Button>
    </form>
  );
}
