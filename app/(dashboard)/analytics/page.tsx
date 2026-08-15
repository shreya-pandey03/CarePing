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
import InsightsCard from "@/components/analytics/InsightsCard";
import AdvancedHeatmap from "@/components/analytics/AdvancedHeatmap";
import StreakPrediction from "@/components/ai/StreakPrediction";
import HabitHealth from "@/components/analytics/HabitHealth";
import HabitScoreCard from "@/components/analytics/HabitScoreCard";
import HabitScore from "@/components/analytics/HabitScore";
import WeeklyGrade from "@/components/analytics/WeeklyGrade";
import BestTimeAnalytics from "@/components/analytics/BestTimeAnalytics";

import { getHeatmap } from "@/actions/analytics/getHeatmap";
import { buildAIContext } from "@/lib/ai/context";
import { calculateHabitScore } from "@/lib/habit-score/calculateHabitScore";
import { calculateBestTime } from "@/lib/analytics/best-time";

export default async function AnalyticsPage() {
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

  const bestTimeAnalytics = userHabits.map((habit) =>
    calculateBestTime(habit.id, habit.title, logs),
  );

  const aiContext = buildAIContext(userHabits, logs, userStreaks);

  const habitPerformance = userHabits.map((habit) => {
    const streak = userStreaks.find((s) => s.habitId === habit.id);

    return calculateHabitPerformance(habit, logs, streak);
  });

  const weeklyHistory = await getWeeklyHistory();
  const monthlyHistory = await getMonthlyHistory();

  const [
    dashboardResult,
    weeklyResult,
    monthlyResult,
    historyResult,
    heatmapResult,
  ] = await Promise.allSettled([
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

  const totalHabits = userHabits.length;

  const today = new Date();

  const completedToday = logs.filter((log) => {
    const date = new Date(log.completedAt);

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }).length;

  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const currentStreak =
    userStreaks.length > 0
      ? Math.max(...userStreaks.map((streak) => streak.currentStreak))
      : 0;

  const longestStreak =
    userStreaks.length > 0
      ? Math.max(...userStreaks.map((streak) => streak.longestStreak))
      : 0;

  const totalCompleted = logs.length;

  const habitScore = calculateHabitScore({
    completionRate,
    currentStreak,
    longestStreak,
    totalCompleted,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your progress over time.</p>
      </div>

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

      <DailyCompletionChart title="Last 7 Days" data={weeklyHistory} />

      <DailyCompletionChart title="Last 30 Days" data={monthlyHistory} />

      <ConsistencyChart data={history.consistencyData} />

      <StreakChart data={history.streakData} />

      <HabitPerformance data={habitPerformance} />

      <HabitScore data={habitScore as any} />

      <BestTimeAnalytics data={bestTimeAnalytics} />

      <AdvancedHeatmap data={history.heatmapData} />

      <CorrelationChart data={history.correlationData} />

      <InsightsCard insights={aiContext.insights} />

      <StreakPrediction predictions={aiContext.streakPredictions} />

      <HabitHealth
        data={aiContext.healthScores.map((h: any) => ({
          ...h,
          completedToday: h.completedToday ?? 0,
        }))}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <HabitScoreCard score={habitScore} />
        <WeeklyGrade grade={aiContext.weeklyGrade} />
      </div>

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
