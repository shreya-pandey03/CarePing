import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { calculateHabitPerformance } from "@/lib/habit-performance";
import { generateRecommendations } from "@/lib/recommendations/generateRecommendations";
import RecommendationsList from "@/components/recommendations/RecommendationsList";

export default async function RecommendationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [userHabits, logs, userStreaks] = await Promise.all([
    db.query.habits.findMany({
      where: eq(habits.userId, userId),
    }),

    db.query.habitLogs.findMany({
      where: eq(habitLogs.userId, userId),
    }),

    db.query.streaks.findMany({
      where: eq(streaks.userId, userId),
    }),
  ]);

  const habitPerformance = userHabits.map((habit) => {
    const streak = userStreaks.find((item) => item.habitId === habit.id);

    const perf = calculateHabitPerformance(habit, logs, streak);

    // ensure the returned object includes `id` (HabitData expects `id`)
    return {
      ...perf,
      id: habit.id,
    };
  });

  const recommendations = generateRecommendations(habitPerformance);

  return (
    <main className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Recommendations</h1>

        <p className="text-muted-foreground">
          Personalized suggestions to help you build stronger habits.
        </p>
      </div>

      <RecommendationsList recommendations={recommendations} />
    </main>
  );
}
