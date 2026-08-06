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
import CorrelationChart from "@/components/analytics/CorrelationChart";
import HabitPerformance from "@/components/analytics/HabitPerformance";
import { getHeatmap } from "@/actions/analytics/getHeatmap";
import InsightsCard from "@/components/analytics/InsightsCard";
import { generateInsights } from "@/lib/insights/generateInsights";
import AdvancedHeatmap from "@/components/analytics/AdvancedHeatmap";
import { calculateStreakRisk } from "@/lib/ai/streak-risk";
import StreakPrediction from "@/components/ai/StreakPrediction";
import HabitHealth from "@/components/analytics/HabitHealth";
import { calculateHabitHealth } from "@/lib/ai/habit-health";
import WeeklyGrade from "@/components/analytics/WeeklyGrade";
import { calculateWeeklyGrade } from "@/lib/analytics/weekly-grade";
import { buildAIContext } from "@/lib/ai/context";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Load Habit Data

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

  const aiContext = buildAIContext(userHabits, logs, userStreaks);

  // Habit Performance Data

  const habitPerformance = userHabits.map((habit) => {
    const streak = userStreaks.find((s) => s.habitId === habit.id);

    return calculateHabitPerformance(habit, logs, streak);
  });

  // Chart Data

  const weeklyHistory = await getWeeklyHistory();

  const monthlyHistory = await getMonthlyHistory();

  const [dashboardResult, weeklyResult, monthlyResult, historyResult] =
    await Promise.allSettled([
      getDashboardAnalytics(userId),
      getWeeklyAnalytics(userId),
      getMonthlyAnalytics(userId),
      getCompletionHistory(userId),
      getHeatmap(),
    ]);

  const dashboard =
    dashboardResult.status === "fulfilled"
      ? dashboardResult.value
      : {
          totalHabits: 0,
          completedToday: 0,
          completionRate: 0,
        };

  const weekly =
    weeklyResult.status === "fulfilled"
      ? weeklyResult.value
      : {
          completionRate: 0,
          completedHabits: 0,
          totalHabits: 0,
          currentWeek: "Unavailable",
        };

  const monthly =
    monthlyResult.status === "fulfilled"
      ? monthlyResult.value
      : {
          completionRate: 0,
          completedHabits: 0,
          totalHabits: 0,
          month: "-",
          year: "-",
        };

  const history =
    historyResult.status === "fulfilled"
      ? historyResult.value
      : {
          completionData: [],
          consistencyData: [],
          streakData: [],
          heatmapData: [],
          correlationData: [],
        };

  const predictions = calculateStreakRisk(userHabits, logs, userStreaks);
  const healthScores = calculateHabitHealth(userHabits, logs, userStreaks);
  const weeklyGrade = calculateWeeklyGrade(userHabits, logs, userStreaks);

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
      <DailyCompletionChart title="Last 7 Days" data={weeklyHistory} />

      <DailyCompletionChart title="Last 30 Days" data={monthlyHistory} />

      {/* Consistency */}

      <ConsistencyChart data={history.consistencyData} />

      {/* Streak */}

      <StreakChart data={history.streakData} />

      {/* Habit Performance */}

      <HabitPerformance data={habitPerformance} />

      {/* Heatmap */}

      <AdvancedHeatmap data={history.heatmapData} />

      {/* Correlation */}

      <CorrelationChart data={history.correlationData} />
      <InsightsCard insights={aiContext.insights} />
      <StreakPrediction predictions={aiContext.streakPredictions} />
      <HabitHealth data={aiContext.healthScores} />
      <WeeklyGrade grade={aiContext.weeklyGrade} />

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
