import { Worker, Job } from "bullmq";
import { and, eq, gte, lte } from "drizzle-orm";
import { connection } from "@/lib/bullmq";
import { db } from "@/lib/db";
import { habits, habitLogs, monthlyReports, streaks } from "@/drizzle/schema";
import { generateWeeklyReport } from "@/actions/generateWeeklyReport";

interface MonthlyReportJobData {
  userId: string;
}

export const monthlyReportWorker = new Worker<MonthlyReportJobData>(
  "monthly-reports",

  async (job: Job<MonthlyReportJobData>) => {
    try {
      const { userId } = job.data;

      console.log(`Generating Monthly Report for ${userId}`);

      // Current Month

      const now = new Date();

      const month = now.getMonth() + 1;

      const year = now.getFullYear();

      const start = new Date(year, month - 1, 1);

      const end = new Date(year, month, 0, 23, 59, 59, 999);

      // Load Habits

      const userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
      });

      // Load Logs

      const logs = await db.query.habitLogs.findMany({
        where: and(
          eq(habitLogs.userId, userId),
          gte(habitLogs.completedAt, start),
          lte(habitLogs.completedAt, end),
        ),
      });

      // Load Streaks

      const userStreaks = await db.query.streaks.findMany({
        where: eq(streaks.userId, userId),
      });

      // Completion Rate

      const totalHabits = userHabits.length;

      const completedHabits = logs.length;

      const completionRate =
        totalHabits === 0
          ? 0
          : Number(((completedHabits / totalHabits) * 100).toFixed(2));

      // AI Report

      const ai = await generateWeeklyReport({
        habits: userHabits,
        logs,
        streaks: userStreaks,
      });

      // Save Report

      await db.insert(monthlyReports).values({
        id: crypto.randomUUID(),

        userId,

        month,

        year,

        completionRate,

        totalHabits,

        completedHabits,

        report: JSON.stringify(ai),

        aiSummary: ai.summary,
      });

      console.log("Monthly Report Saved");

      return {
        success: true,
      };
    } catch (error) {
      console.error("Monthly Report Worker Error", error);

      throw error;
    }
  },
  {
    connection,
    concurrency: 1,
  },
);

monthlyReportWorker.on("completed", (job) => {
  console.log(`Monthly Report Job ${job.id} completed`);
});

monthlyReportWorker.on("failed", (job, err) => {
  console.error(`Monthly Report Job ${job?.id} failed`, err);
});

monthlyReportWorker.on("error", (err) => {
  console.error(err);
});
