export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          View your weekly and monthly AI habit reports.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/reports/weekly"
          className="rounded-lg border p-6 hover:bg-muted transition-colors"
        >
          <h2 className="text-xl font-semibold">Weekly Reports</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Review your weekly habit progress and AI insights.
          </p>
        </a>

        <a
          href="/reports/monthly"
          className="rounded-lg border p-6 hover:bg-muted transition-colors"
        >
          <h2 className="text-xl font-semibold">Monthly Reports</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Analyze long-term trends and performance.
          </p>
        </a>
      </div>
    </div>
  );
}