import { Worker, Job } from "bullmq";
import { eq } from "drizzle-orm";
import { connection } from "@/lib/bullmq";
import { db } from "@/lib/db";
import { habits, habitLogs, streaks, aiInsights } from "@/drizzle/schema";
import { generateAIInsights } from "@/actions/generateAIInsights";

interface AIJobData {
  userId: string;
  habitId: string;
}

export const aiWorker = new Worker<AIJobData>(
  "ai-insights",
  async (job: Job<AIJobData>) => {
    try {
      const { userId } = job.data;
      console.log(`Generating AI Insights for ${userId}`);
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
      // Generate AI Report

      const result = await generateAIInsights({
        habits: userHabits,
        logs,
        streaks: userStreaks,
      });

      // Save Insight
      await db.insert(aiInsights).values({
        id: crypto.randomUUID(),
        userId,
        title: result.title,
        summary: result.summary,
        content: result.content,
        createdAt: new Date(),
      });
      console.log(`AI Insight Saved`);
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 2,
  },
);

aiWorker.on("completed", (job) => {
  console.log(`AI Job ${job.id} Completed`);
});

aiWorker.on("failed", (job, err) => {
  console.error(`AI Job ${job?.id} Failed`, err);
});

aiWorker.on("error", (err) => {
  console.error("AI Worker Error", err);
});
