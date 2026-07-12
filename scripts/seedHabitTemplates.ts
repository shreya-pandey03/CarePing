import { db } from "@/lib/db";

import { habits } from "@/drizzle/schema";

const habitTemplates = [
  {
    id: crypto.randomUUID(),
    userId: "system",
    title: "Drink Water",
    description:
      "Drink enough water throughout the day.",
    category: "health",
    frequency: "daily",
    targetDays: 1,
    icon: "💧",
    active: true,
    archived: false,
  },
  {
    id: crypto.randomUUID(),
    userId: "system",
    title: "Exercise",
    description:
      "Complete a workout or physical activity.",
    category: "fitness",
    frequency: "daily",
    targetDays: 1,
    icon: "🏋️",
    active: true,
    archived: false,
  },
  {
    id: crypto.randomUUID(),
    userId: "system",
    title: "Read Books",
    description:
      "Read and learn something new.",
    category: "reading",
    frequency: "daily",
    targetDays: 1,
    icon: "📚",
    active: true,
    archived: false,
  },
  {
    id: crypto.randomUUID(),
    userId: "system",
    title: "Practice Coding",
    description:
      "Improve programming skills daily.",
    category: "coding",
    frequency: "daily",
    targetDays: 1,
    icon: "💻",
    active: true,
    archived: false,
  },
  {
    id: crypto.randomUUID(),
    userId: "system",
    title: "Meditation",
    description:
      "Spend time improving mindfulness.",
    category: "mindfulness",
    frequency: "daily",
    targetDays: 1,
    icon: "🧘",
    active: true,
    archived: false,
  },
  {
    id: crypto.randomUUID(),
    userId: "system",
    title: "Sleep Schedule",
    description:
      "Maintain a consistent sleep routine.",
    category: "health",
    frequency: "daily",
    targetDays: 1,
    icon: "😴",
    active: true,
    archived: false,
  },
];

async function seedHabitTemplates() {
  try {
    await db
      .insert(habits)
      .values(habitTemplates);

    console.log(
      "Habit templates seeded successfully"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed habit templates:",
      error
    );

    process.exit(1);
  }
}

seedHabitTemplates();