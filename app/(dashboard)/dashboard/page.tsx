import DashboardStats from "@/components/dashboard/DashboardStats";
import ProgressCards from "@/components/dashboard/ProgressCards";
import WeeklySummary from "@/components/dashboard/WeeklySummary";
import HabitHeatmap from "@/components/dashboard/HabitHeatmap";

export default async function DashboardPage() {
  /**
   * Week 1:
   * Static UI
   *
   * Week 2:
   * Replace these values with database queries.
   */

  const stats = {
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    activeGoals: 0,
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          Track your habits, monitor your streaks, and improve every day.
        </p>
      </section>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Progress */}
      <ProgressCards />

      {/* Weekly Summary */}
      <WeeklySummary />

      {/* Heatmap */}
      <HabitHeatmap />
    </div>
  );
}
