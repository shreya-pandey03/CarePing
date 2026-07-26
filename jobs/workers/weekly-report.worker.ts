import { Worker, Job } from "bullmq";

import { connection } from "@/lib/bullmq";
import { generateWeeklyReport } from "@/actions/generateWeeklyReport";

interface WeeklyReportJobData {
  userId: string;
}

export const weeklyReportWorker = new Worker(
  "weekly-reports",
  async (job: Job<WeeklyReportJobData>) => {
    try {
      const { userId } = job.data;

      console.log(`Generating Weekly Report for ${userId}`);

      const result = await generateWeeklyReport(userId);

      console.log("Weekly Report Saved");

      return result;
    } catch (error) {
      console.error("Weekly Report Worker Error:", error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 1,
    lockDuration: 8 * 60 * 1000, // 8 minutes
  },
);

weeklyReportWorker.on("completed", (job) => {
  console.log(`Weekly Report Job ${job.id} completed`);
});

weeklyReportWorker.on("failed", (job, err) => {
  console.error(`Weekly Report Job ${job?.id} failed`, err);
});

weeklyReportWorker.on("error", (err) => {
  console.error("Weekly Report Worker Error:", err);
});
