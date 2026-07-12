import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/drizzle";
import { habits, streaks } from "@/drizzle/schema";
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
    with: {
      logs: true,
    },
    orderBy: (habits, { desc }) => [desc(habits.createdAt)],
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Habits</h1>

          <p className="text-muted-foreground">
            Manage your daily habits and keep your streak alive.
          </p>
        </div>

        <Button asChild>
          <Link href="/habits/new">
            <Plus className="mr-2 h-4 w-4" />
            New Habit
          </Link>
        </Button>
      </div>

      {userHabits.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <h2 className="text-xl font-semibold">No habits yet</h2>

            <p className="mt-2 text-muted-foreground">
              Create your first habit to begin tracking your progress.
            </p>

            <Button asChild className="mt-6">
              <Link href="/habits/new">Create Habit</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {userHabits.map((habit) => {
            const streak = userStreaks.find((s) => s.habitId === habit.id);

            const completedToday = habit.logs.some((log) => {
              const today = new Date();

              return log.completedAt.toDateString() === today.toDateString();
            });

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                streak={streak?.currentStreak ?? 0}
                completedToday={completedToday}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
