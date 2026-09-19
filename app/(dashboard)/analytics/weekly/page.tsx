import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { getWeeklyAnalytics } from "@/lib/analytics/weekly";

export default async function WeeklyAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const weekly = await getWeeklyAnalytics(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Weekly Analytics</h1>

        <p className="text-muted-foreground">
          Track your habit progress for this week.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Total Habits</p>

          <p className="mt-2 text-3xl font-bold">{weekly.totalHabits}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Completed Habits</p>

          <p className="mt-2 text-3xl font-bold">{weekly.completedHabits}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Completion Rate</p>

          <p className="mt-2 text-3xl font-bold">{weekly.completionRate}%</p>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold">{weekly.currentWeek}</h2>

        <p className="mt-2 text-muted-foreground">
          Weekly habit performance overview.
        </p>
      </div>
    </div>
  );
}
