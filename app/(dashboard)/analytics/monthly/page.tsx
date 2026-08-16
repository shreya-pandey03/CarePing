import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { getMonthlyAnalytics } from "@/lib/analytics/monthly";

export default async function MonthlyAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const monthly = await getMonthlyAnalytics(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Monthly Analytics</h1>
        <p className="text-muted-foreground">
          Track your habit progress for this month.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Total Habits</p>
          <p className="mt-2 text-3xl font-bold">{monthly.totalHabits}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Completed Habits</p>
          <p className="mt-2 text-3xl font-bold">{monthly.completedHabits}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="mt-2 text-3xl font-bold">{monthly.completionRate}%</p>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold">
          {monthly.month}/{monthly.year}
        </h2>

        <p className="mt-2 text-muted-foreground">
          Monthly habit performance overview.
        </p>
      </div>
    </div>
  );
}
