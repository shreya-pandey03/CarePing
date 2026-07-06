"use client";

import { useState } from "react";

export default function HabitForm() {
  const [title, setTitle] = useState("");

  async function createHabit() {
    await fetch("/api/habits/create", {
      method: "POST",

      body: JSON.stringify({
        title,
        category: "Health",
        frequency: "daily",
      }),
    });
  }

  return (
    <div className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Habit name"
        className="border p-2"
      />

      <button
        onClick={createHabit}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Create Habit
      </button>
    </div>
  );
}
