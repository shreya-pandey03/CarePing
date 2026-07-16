import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { weeklyReports } from "@/drizzle/schema";
import WeeklyCoachReport from "@/components/ai/WeeklyCoachReport";

export default async function WeeklyReportsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const reports = await db.query.weeklyReports.findMany({
    where: eq(weeklyReports.userId, session.user.id),
    orderBy: (table, { desc }) => [desc(table.generatedAt)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Weekly Reports</h1>

        <p className="text-muted-foreground">
          Review your AI-generated weekly coaching reports and track your
          progress over time.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <h2 className="text-xl font-semibold">No Weekly Reports</h2>

          <p className="mt-2 text-muted-foreground">
            Your first AI weekly report will appear after enough habit activity
            has been recorded.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {reports.map((report) => (
            <WeeklyCoachReport
              key={report.id}
              week={`${report.weekStart.toLocaleDateString()} - ${report.weekEnd.toLocaleDateString()}`}
              score={Math.round(report.completionRate)}
              summary={report.summary}
              strengths={report.strengths}
              improvements={report.improvements}
              recommendations={report.recommendations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
