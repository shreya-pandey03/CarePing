import { Worker, Job } from "bullmq";
import { eq } from "drizzle-orm";

import { connection } from "@/lib/bullmq";
import { db } from "@/drizzle";

import { habits, habitLogs, streaks, weeklyReports } from "@/drizzle/schema";

import { generateWeeklyReport } from "@/actions/generateWeeklyReport";

interface WeeklyReportJobData {
  userId: string;
}

export const weeklyReportWorker = new Worker<WeeklyReportJobData>(
  "weekly-reports",

  async (job: Job<WeeklyReportJobData>) => {
    try {
      const { userId } = job.data;

      console.log(`Generating weekly report for ${userId}`);

      // Load Habits

      const userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
      });

      // Load Logs

      const logs = await db.query.habitLogs.findMany({
        where: eq(habitLogs.userId, userId),
      });

      // Load Streaks

      const userStreaks = await db.query.streaks.findMany({
        where: eq(streaks.userId, userId),
      });

      // Generate AI Weekly Report

      const report = await generateWeeklyReport({
        habits: userHabits,
        logs,
        streaks: userStreaks,
      });

      // Calculate Week Range

      const now = new Date();

      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(now);
      weekEnd.setHours(23, 59, 59, 999);

      // Save Report

      await db.insert(weeklyReports).values({
        id: crypto.randomUUID(),
        userId,
        title: report.title,
        summary: report.summary,
        strengths: report.strengths,
        improvements: report.improvements,
        recommendations: report.recommendations,
        weekStart,
        weekEnd,
      });

      console.log(`Weekly report saved for ${userId}`);

      return {
        success: true,
      };
    } catch (error) {
      console.error("Weekly Report Worker Error:", error);

      throw error;
    }
  },

  {
    connection,
    concurrency: 1,
  },
);

weeklyReportWorker.on("completed", (job) => {
  console.log(`Weekly Report Job ${job.id} completed`);
});

weeklyReportWorker.on("failed", (job, err) => {
  console.error(`Weekly Report Job ${job?.id} failed`, err);
});

weeklyReportWorker.on("error", (err) => {
  console.error("Weekly Report Worker Error", err);
});
