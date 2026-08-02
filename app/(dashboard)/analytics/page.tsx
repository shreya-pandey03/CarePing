import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { habits, habitLogs, streaks } from "@/drizzle/schema";
import { getDashboardAnalytics } from "@/lib/analytics/dashboard";
import { getWeeklyAnalytics } from "@/lib/analytics/weekly";
import { getMonthlyAnalytics } from "@/lib/analytics/monthly";
import { getCompletionHistory } from "@/lib/analytics/history";
import {
  getWeeklyHistory,
  getMonthlyHistory,
} from "@/actions/analytics/getAnalyticsHistory";
import { calculateHabitPerformance } from "@/lib/habit-performance";
import DailyCompletionChart from "@/components/analytics/DailyCompletionChart";
import ConsistencyChart from "@/components/analytics/ConsistencyChart";
import StreakChart from "@/components/analytics/StreakChart";
import Heatmap from "@/components/analytics/Heatmap";
import CorrelationChart from "@/components/analytics/CorrelationChart";
import HabitPerformance from "@/components/analytics/HabitPerformance";
import { getHeatmap } from "@/actions/analytics/getHeatmap";
import InsightsCard from "@/components/analytics/InsightsCard";
import { generateInsights } from "@/lib/insights/generateInsights";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Load Habit Data

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  const insights = generateInsights({
    habits: userHabits,
    logs,
    streaks: userStreaks,
  });

  // Habit Performance Data

  const habitPerformance = userHabits.map((habit) => {
    const streak = userStreaks.find((s) => s.habitId === habit.id);

    return calculateHabitPerformance(habit, logs, streak);
  });

  // Chart Data

  const weeklyHistory = await getWeeklyHistory();

  const monthlyHistory = await getMonthlyHistory();

  const [dashboard, weekly, monthly, history, heatmap] = await Promise.all([
    getDashboardAnalytics(userId),
    getWeeklyAnalytics(userId),
    getMonthlyAnalytics(userId),
    getCompletionHistory(userId),
    getHeatmap(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>

        <p className="text-muted-foreground">Track your progress over time.</p>
      </div>

      {/* Dashboard Stats */}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <h3>Total Habits</h3>

          <p className="text-3xl font-bold">{dashboard.totalHabits}</p>
        </div>

        <div className="rounded-xl border p-5">
          <h3>Today's Completion</h3>

          <p className="text-3xl font-bold">{dashboard.completedToday}</p>
        </div>

        <div className="rounded-xl border p-5">
          <h3>Completion Rate</h3>

          <p className="text-3xl font-bold">{dashboard.completionRate}%</p>
        </div>
      </div>

      {/* Daily Charts */}

      <DailyCompletionChart data={weeklyHistory} />

      <DailyCompletionChart data={monthlyHistory} />

      {/* Consistency */}

      <ConsistencyChart data={history.consistencyData} />

      {/* Streak */}

      <StreakChart data={history.streakData} />

      {/* Habit Performance */}

      <HabitPerformance data={habitPerformance} />

      {/* Heatmap */}

      <Heatmap values={heatmap} />

      {/* Correlation */}

      <CorrelationChart data={history.correlationData} />
      <InsightsCard insights={insights} />
      {/* Weekly + Monthly Analytics */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Weekly Analytics</h2>

          <p>Completion Rate: {weekly.completionRate}%</p>

          <p>Completed: {weekly.completedHabits}</p>

          <p>Total: {weekly.totalHabits}</p>

          <p>{weekly.currentWeek}</p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Monthly Analytics</h2>

          <p>Completion Rate: {monthly.completionRate}%</p>

          <p>Completed: {monthly.completedHabits}</p>

          <p>Total: {monthly.totalHabits}</p>

          <p>
            {monthly.month}/{monthly.year}
          </p>
        </div>
      </div>
    </div>
  );
}
