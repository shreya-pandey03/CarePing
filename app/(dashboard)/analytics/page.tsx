import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { calculateCompletionRate, calculateConsistency } from "@/lib/analytics";
import CompletionChart from "@/components/analytics/CompletionChart";
import ConsistencyChart from "@/components/analytics/ConsistencyChart";
import StreakChart from "@/components/analytics/StreakChart";
import Heatmap from "@/components/analytics/Heatmap";
import CorrelationChart from "@/components/analytics/CorrelationChart";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const userId = session.user.id;
  // Load Data
  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });
  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });
  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  // Dashboard Metrics
  const totalHabits = userHabits.length;
  const completedHabits = logs.length;
  const completionRate = calculateCompletionRate(
    completedHabits,
    Math.max(totalHabits, 1),
  );
  const consistency = calculateConsistency(
    userStreaks.map((s) => s.currentStreak),
  );

  // Chart Data

  const completionData = [
    {
      date: "Overall",
      completionRate,
    },
  ];
  const consistencyData = [
    {
      label: "Consistency",
      consistency,
    },
  ];
  const streakData = userStreaks.map((streak) => ({
    date: streak.updatedAt.toLocaleDateString(),
    streak: streak.currentStreak,
  }));

  const heatmapData = logs.map((log) => ({
    date: log.completedAt.toISOString().split("T")[0],
    count: 1,
  }));
  const correlationData = userHabits.map((habit) => {
    const streak = userStreaks.find((s) => s.habitId === habit.id);
    return {
      habit: habit.title,
      completionRate,
      consistency,
      streak: streak?.currentStreak ?? 0,
    };
  });
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <CompletionChart data={completionData} />
      <ConsistencyChart data={consistencyData} />
      <StreakChart data={streakData} />
      <Heatmap values={heatmapData} />
      <CorrelationChart data={correlationData} />
    </div>
  );
}
