export default function MonthlyOverview({ monthly }: { monthly: any }) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-6 text-xl font-semibold">Monthly Analytics</h2>

      <div className="space-y-3">
        <p>
          Month: {monthly.month}/{monthly.year}
        </p>

        <p>Completion Rate: {monthly.completionRate}%</p>

        <p>Completed Habits: {monthly.completedHabits}</p>

        <p>Total Habits: {monthly.totalHabits}</p>
      </div>
    </div>
  );
}
