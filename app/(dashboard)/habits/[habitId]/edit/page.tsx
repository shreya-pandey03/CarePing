import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits } from "@/drizzle/schema";
import HabitForm from "@/components/habits/HabitForm";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    habitId: string;
  }>;
}

export default async function EditHabitPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { habitId } = await params;

  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, session.user.id)),
  });

  if (!habit) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href={`/habits/${habit.id}`}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Habit</h1>

        <p className="mt-2 text-muted-foreground">
          Update your habit details and tracking preferences.
        </p>
      </div>

      <HabitForm
        habitId={habit.id}
        defaultValues={{
          title: habit.title,
          description: habit.description ?? "",
          category: habit.category,
          frequency: habit.frequency,
          targetDays: habit.targetDays,
          reminderTime: habit.reminderTime ?? "",
          active: habit.active,
        }}
      />
    </div>
  );
}
