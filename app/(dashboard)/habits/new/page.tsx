import { redirect } from "next/navigation";

import { auth } from "@/auth";

import HabitForm from "@/components/habits/HabitForm";

export default async function NewHabitPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Habit</h1>

        <p className="mt-2 text-muted-foreground">
          Build a new habit and start tracking your progress every day.
        </p>
      </div>

      <HabitForm />
    </div>
  );
}
