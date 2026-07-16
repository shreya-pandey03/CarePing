import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { Pencil, ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";

import { habits, habitLogs, streaks } from "@/drizzle/schema";

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
  const userId = session.user.id;

  // Get Habit
  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
  });

  if (!habit) {
    notFound();
  }

  // Get Habit Logs
  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.habitId, habitId),
    orderBy: (logs, { desc }) => [desc(logs.completedAt)],
  });

  // Get Streak
  const streak = await db.query.streaks.findFirst({
    where: eq(streaks.habitId, habitId),
  });

  const completedToday = logs.some((log) => {
    const today = new Date();

    return log.completedAt.toDateString() === today.toDateString();
  });

  const progress =
    logs.length === 0 ? 0 : Math.min((logs.length / 30) * 100, 100);

  const today = new Date();

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  const calendarData = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;

    const completed = logs.some((log) => {
      const completedDate = log.completedAt;

      return (
        completedDate.getFullYear() === today.getFullYear() &&
        completedDate.getMonth() === today.getMonth() &&
        completedDate.getDate() === day
      );
    });

    return {
      date: String(day),
      completed,
    };
  });

  const month = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/habits">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <Link href={`/habits/${habit.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Habit
          </Button>
        </Link>
      </div>

      <HabitCard
        id={habit.id}
        title={habit.title}
        description={habit.description ?? undefined}
        category={habit.category}
        frequency={habit.frequency}
        streak={streak?.currentStreak ?? 0}
        completion={progress}
        reminderTime={habit.reminderTime ?? undefined}
        active={habit.active}
      />

      <HabitProgress
        completedToday={completedToday}
        completionRate={progress}
        currentStreak={streak?.currentStreak ?? 0}
        longestStreak={streak?.longestStreak ?? 0}
        targetDays={habit.targetDays}
      />

      <HabitCalendar month={month} data={calendarData} />
    </div>
  );
}
