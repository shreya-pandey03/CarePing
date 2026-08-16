import { auth } from "@/auth";
import { getYearlyAnalytics } from "@/lib/analytics/yearly";
import { redirect } from "next/navigation";

export default async function YearlyAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const yearly = await getYearlyAnalytics(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Yearly Analytics</h1>

        <p className="text-muted-foreground">
          Track your habit progress throughout the year.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Total Habits</p>

          <p className="mt-2 text-3xl font-bold">{yearly.totalHabits}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Completed Habits</p>

          <p className="mt-2 text-3xl font-bold">{yearly.completedHabits}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Completion Rate</p>

          <p className="mt-2 text-3xl font-bold">{yearly.completionRate}%</p>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold">{yearly.year}</h2>

        <p className="mt-2 text-muted-foreground">
          Yearly habit performance overview.
        </p>
      </div>
    </div>
  );
}
