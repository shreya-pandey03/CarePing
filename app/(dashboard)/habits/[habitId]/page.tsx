import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Pencil } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/drizzle";
import { habits, streaks } from "@/drizzle/schema";
import HabitCard from "@/components/habits/HabitCard";
import HabitCalendar from "@/components/habits/HabitCalendar";
import HabitProgress from "@/components/habits/HabitProgress";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    habitId: string;
  }>;
}

export default async function HabitDetailsPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { habitId } = await params;

  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, session.user.id)),
    with: {
      logs: true,
    },
  });

  if (!habit) {
    notFound();
  }

  const streak = await db.query.streaks.findFirst({
    where: eq(streaks.habitId, habitId),
  });

  const completedToday = habit.logs.some((log) => {
    const today = new Date();

    return log.completedAt.toDateString() === today.toDateString();
  });

  const progress =
    habit.logs.length === 0 ? 0 : Math.min((habit.logs.length / 30) * 100, 100);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/habits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <Button asChild>
          <Link href={`/habits/${habit.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Habit
          </Link>
        </Button>
      </div>

      <HabitCard
        habit={habit}
        streak={streak?.currentStreak ?? 0}
        completedToday={completedToday}
      />

      <HabitProgress
        currentStreak={streak?.currentStreak ?? 0}
        longestStreak={streak?.longestStreak ?? 0}
        progress={progress}
      />

      <HabitCalendar logs={habit.logs} />
    </div>
  );
}
