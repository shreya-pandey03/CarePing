import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";

import { db } from "@/lib/db";

import {
  habits,
  habitLogs,
  streaks,
  weeklyReports,
  notifications,
} from "@/drizzle/schema";

import DashboardStats from "@/components/dashboard/DashboardStats";
import ProgressCards from "@/components/dashboard/ProgressCards";
import WeeklySummary from "@/components/dashboard/WeeklySummary";
import HabitHeatmap from "@/components/dashboard/HabitHeatmap";
import RecentActivity from "@/components/dashboard/RecentActivity";

import AIInsightCard from "@/components/ai/AIInsightCard";
import MotivationCard from "@/components/ai/MotivationCard";
import StreakPrediction from "@/components/ai/StreakPrediction";

import { calculateCompletionRate, calculateConsistency } from "@/lib/analytics";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Load User Data

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),

    orderBy: (logs, { desc }) => [desc(logs.completedAt)],
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  // Weekly AI Report

  const report = await db.query.weeklyReports.findFirst({
    where: eq(weeklyReports.userId, userId),

    orderBy: (reports, { desc }) => [desc(reports.generatedAt)],
  });

  // Notifications

  const recentNotifications = await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),

    limit: 5,

    orderBy: (notification, { desc }) => [desc(notification.createdAt)],
  });

  // Dashboard Stats

  const totalHabits = userHabits.length;

  const completedToday = logs.filter((log) => {
    const today = new Date();

    return log.completedAt.toDateString() === today.toDateString();
  }).length;

  const currentStreak =
    userStreaks.length > 0
      ? Math.max(...userStreaks.map((s) => s.currentStreak))
      : 0;

  const completionRate = calculateCompletionRate(
    logs.length,
    Math.max(totalHabits, 1),
  );

  const consistency = calculateConsistency(
    userStreaks.map((s) => s.currentStreak),
  );

  // Heatmap

  const heatmapData = logs.map((log) => ({
    date: log.completedAt.toISOString().split("T")[0],

    count: 1,
  }));

  // Activity Feed

  const activities = recentNotifications.map((notification) => ({
    id: notification.id,

    title: notification.title,

    description: notification.message,

    type: "notification" as const,

    createdAt: notification.createdAt,
  }));

  // Streak Prediction

  type Prediction = {
    habit: string;
    risk: "low" | "medium" | "high";
    score: number;
    recommendation: string;
  };

  const predictions: Prediction[] = userHabits.map((habit) => {
    const streak = userStreaks.find((s) => s.habitId === habit.id);

    const current = streak?.currentStreak ?? 0;

    let risk: "low" | "medium" | "high";
    let score: number;

    if (current >= 14) {
      risk = "low";
      score = 20;
    } else if (current >= 5) {
      risk = "medium";
      score = 55;
    } else {
      risk = "high";
      score = 85;
    }

    return {
      habit: habit.title,
      risk,
      score,
      recommendation:
        current >= 14
          ? "Excellent consistency. Keep protecting this streak."
          : current >= 5
            ? "Good progress. Stay consistent to strengthen this habit."
            : "Complete this habit today to build momentum.",
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>

        <p className="text-muted-foreground">
          Here's your habit overview for today.
        </p>
      </div>

      <DashboardStats
        totalHabits={totalHabits}
        completedToday={completedToday}
        currentStreak={currentStreak}
        completionRate={completionRate}
      />

      <ProgressCards
        dailyProgress={completionRate}
        weeklyProgress={consistency}
        monthlyProgress={completionRate}
      />

      {report && (
        <WeeklySummary
          title={report.title}
          summary={report.summary}
          completionRate={report.completionRate}
          bestStreak={currentStreak}
          recommendations={report.recommendations}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <HabitHeatmap values={heatmapData} />

        <RecentActivity activities={activities} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AIInsightCard
          title="AI Insight"
          summary={
            "You're maintaining excellent consistency. Keep building your daily habits."
          }
          confidence={95}
          createdAt={new Date()}
        />

        <MotivationCard
          title="Today's Motivation"
          message={
            "Small actions repeated every day create extraordinary results. Keep your streak alive!"
          }
          streak={currentStreak}
          completedToday={completedToday}
          goalToday={totalHabits}
        />
      </div>

      <StreakPrediction predictions={predictions} />
    </div>
  );
}
