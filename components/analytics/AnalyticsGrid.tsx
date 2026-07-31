import DashboardOverview from "./DashboardOverview";
import WeeklyOverview from "./WeeklyOverview";
import MonthlyOverview from "./MonthlyOverview";

export default function AnalyticsGrid({ stats, weekly, monthly }: any) {
  return (
    <div className="space-y-8">
      <DashboardOverview stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyOverview weekly={weekly} />

        <MonthlyOverview monthly={monthly} />
      </div>
    </div>
  );
}
