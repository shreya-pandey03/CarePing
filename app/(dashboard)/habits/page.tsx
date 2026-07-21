import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Plus } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import HabitsClient from "@/components/habits/HabitsClient";
import HabitCard from "@/components/habits/HabitCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function HabitsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
    orderBy: (habits, { desc }) => [desc(habits.createdAt)],
  });

  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  return (
    <div className="space-y-8">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Habits</h1>

          <p className="text-muted-foreground">
            Manage your daily habits and keep your streak alive.
          </p>
        </div>

        <Button>
          <Link href="/habits/new">
            <Plus className="mr-2 h-4 w-4" />
            New Habit
          </Link>
        </Button>
      </div> */}

      {userHabits.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <h2 className="text-xl font-semibold">No habits yet</h2>

            <p className="mt-2 text-muted-foreground">
              Create your first habit to begin tracking your progress.
            </p>

            <Button className="mt-6">
              <Link href="/habits/new">Create Habit</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <HabitsClient
          habits={userHabits.map((habit) => ({
            id: habit.id,
            title: habit.title,
            description: habit.description ?? undefined,
            category: habit.category,
            frequency: habit.frequency,
            reminderTime: habit.reminderTime ?? undefined,
            active: habit.active,
          }))}
          streakMap={Object.fromEntries(
            userStreaks.map((streak) => [
              streak.habitId,
              {
                currentStreak: streak.currentStreak,
                longestStreak: streak.longestStreak,
              },
            ]),
          )}
          completionMap={Object.fromEntries(
            userHabits.map((habit) => [
              habit.id,
              logs.some(
                (log) =>
                  log.habitId === habit.id &&
                  log.completedAt.toDateString() === new Date().toDateString(),
              )
                ? 100
                : 0,
            ]),
          )}
        />
      )}
    </div>
  );
}
