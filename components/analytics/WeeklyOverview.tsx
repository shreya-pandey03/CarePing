export default function WeeklyOverview({ weekly }: { weekly: any }) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-6 text-xl font-semibold">Weekly Analytics</h2>

      <div className="space-y-3">
        <p>Week: {weekly.currentWeek}</p>

        <p>Completion Rate: {weekly.completionRate}%</p>

        <p>Completed Habits: {weekly.completedHabits}</p>

        <p>Total Habits: {weekly.totalHabits}</p>
      </div>
    </div>
  );
}
