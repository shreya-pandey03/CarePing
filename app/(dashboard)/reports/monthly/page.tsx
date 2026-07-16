import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";

import { monthlyReports } from "@/drizzle/schema";

import MonthlyCoachReport from "@/components/ai/MonthlyCoachReport";

export default async function MonthlyReportsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const reports = await db.query.monthlyReports.findMany({
    where: eq(monthlyReports.userId, session.user.id),
    orderBy: (table, { desc }) => [desc(table.generatedAt)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Monthly Reports</h1>

        <p className="text-muted-foreground">
          Review your long-term habit performance, achievements, and AI-powered
          monthly coaching reports.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <h2 className="text-xl font-semibold">No Monthly Reports</h2>

          <p className="mt-2 text-muted-foreground">
            Your monthly AI report will be generated automatically after
            sufficient activity.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {reports.map((report) => (
            <MonthlyCoachReport
              key={report.id}
              month={`${report.month}/${report.year}`}
              score={Math.round(report.completionRate)}
              summary={report.aiSummary ?? report.report}
              completionRate={report.completionRate}
              longestStreak={30}
              achievements={[
                `Completed ${report.completedHabits} habits`,
                `Tracked ${report.totalHabits} habits`,
              ]}
              recommendations={[
                "Stay consistent with your strongest habits.",
                "Focus on improving your weakest habit.",
                "Keep your current morning routine.",
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
