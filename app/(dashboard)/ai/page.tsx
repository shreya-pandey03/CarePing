import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/drizzle";
import {
  insights,
  recommendations,
  weeklyReports,
  monthlyReports,
  streaks,
  habits,
} from "@/drizzle/schema";
import AIInsightCard from "@/components/ai/AIInsightCard";
import WeeklyCoachReport from "@/components/ai/WeeklyCoachReport";
import MonthlyCoachReport from "@/components/ai/MonthlyCoachReport";
import StreakPrediction from "@/components/ai/StreakPrediction";
import MotivationCard from "@/components/ai/MotivationCard";

export default async function AIPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // -----------------------
  // Load AI Data
  // -----------------------

  const latestInsight = await db.query.insights.findFirst({
    where: eq(insights.userId, userId),
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  const latestWeeklyReport = await db.query.weeklyReports.findFirst({
    where: eq(weeklyReports.userId, userId),
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  const latestMonthlyReport = await db.query.monthlyReports.findFirst({
    where: eq(monthlyReports.userId, userId),
    orderBy: (table, { desc }) => [desc(table.generatedAt)],
  });

  const aiRecommendations = await db.query.recommendations.findMany({
    where: eq(recommendations.userId, userId),
    orderBy: (table, { desc }) => [desc(table.createdAt)],
    limit: 5,
  });

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const userStreaks = await db.query.streaks.findMany({
    where: eq(streaks.userId, userId),
  });

  // -----------------------
  // Prediction Data
  // -----------------------

  const predictions = userHabits.map((habit) => {
    const streak = userStreaks.find((s) => s.habitId === habit.id);

    const current = streak?.currentStreak ?? 0;

    return {
      habit: habit.title,
      risk: current >= 14 ? "low" : current >= 5 ? "medium" : "high",

      score: current >= 14 ? 20 : current >= 5 ? 55 : 85,

      recommendation: "Complete this habit today to maintain momentum.",
    } as const;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">AI Coach</h1>

        <p className="text-muted-foreground">
          Personalized insights, reports and recommendations powered by Gemini
          AI.
        </p>
      </div>

      {latestInsight && (
        <AIInsightCard
          title={latestInsight.title}
          summary={latestInsight.summary}
          confidence={latestInsight.confidence ?? 95}
          createdAt={latestInsight.createdAt}
        />
      )}

      {latestWeeklyReport && (
        <WeeklyCoachReport
          week={`${latestWeeklyReport.weekStart.toLocaleDateString()} - ${latestWeeklyReport.weekEnd.toLocaleDateString()}`}
          score={latestWeeklyReport.score ?? 88}
          summary={latestWeeklyReport.summary}
          strengths={latestWeeklyReport.strengths}
          improvements={latestWeeklyReport.improvements}
          recommendations={latestWeeklyReport.recommendations}
        />
      )}

      {latestMonthlyReport && (
        <MonthlyCoachReport
          month={`${latestMonthlyReport.month}/${latestMonthlyReport.year}`}
          score={latestMonthlyReport.completionRate}
          summary={latestMonthlyReport.aiSummary ?? latestMonthlyReport.report}
          completionRate={latestMonthlyReport.completionRate}
          longestStreak={Math.max(
            ...userStreaks.map((s) => s.longestStreak),
            0,
          )}
          achievements={[
            `Completed ${latestMonthlyReport.completedHabits} habits this month`,
            `Tracked ${latestMonthlyReport.totalHabits} habits`,
          ]}
          recommendations={aiRecommendations.map((r) => r.recommendation)}
        />
      )}

      <StreakPrediction predictions={predictions} />

      <MotivationCard
        title="Today's Motivation"
        message="Success comes from small consistent actions. Every completed habit is another step toward your long-term goals."
        streak={Math.max(...userStreaks.map((s) => s.currentStreak), 0)}
        completedToday={0}
        goalToday={userHabits.length}
      />
    </div>
  );
}
