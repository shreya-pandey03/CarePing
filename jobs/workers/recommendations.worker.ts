import { Worker, Job } from "bullmq";
import { eq } from "drizzle-orm";

import { connection } from "@/lib/bullmq";
import { db } from "@/drizzle";

import { habits, habitLogs, streaks, recommendations } from "@/drizzle/schema";

import { generateRecommendations } from "@/actions/generateRecommendations";

interface RecommendationJobData {
  userId: string;
}

export const recommendationWorker = new Worker<RecommendationJobData>(
  "recommendations",

  async (job: Job<RecommendationJobData>) => {
    try {
      const { userId } = job.data;

      console.log(`Generating recommendations for ${userId}`);

      // -----------------------------
      // Load User Habits
      // -----------------------------

      const userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
      });

      // -----------------------------
      // Load Habit Logs
      // -----------------------------

      const logs = await db.query.habitLogs.findMany({
        where: eq(habitLogs.userId, userId),
      });

      // -----------------------------
      // Load Streaks
      // -----------------------------

      const userStreaks = await db.query.streaks.findMany({
        where: eq(streaks.userId, userId),
      });

      // -----------------------------
      // Generate AI Recommendations
      // -----------------------------

      const result = await generateRecommendations({
        habits: userHabits,
        logs,
        streaks: userStreaks,
      });

      // -----------------------------
      // Remove Old Recommendations
      // -----------------------------

      await db
        .delete(recommendations)
        .where(eq(recommendations.userId, userId));

      // -----------------------------
      // Save New Recommendations
      // -----------------------------

      await db.insert(recommendations).values(
        result.recommendations.map((recommendation) => ({
          id: crypto.randomUUID(),
          userId,
          title: "AI Recommendation",
          description: recommendation,
          type: "habit" as const,
        })),
      );

      console.log(`Recommendations saved for ${userId}`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Recommendation Worker Error:", error);

      throw error;
    }
  },

  {
    connection,
    concurrency: 2,
  },
);

recommendationWorker.on("completed", (job) => {
  console.log(`Recommendation Job ${job.id} completed`);
});

recommendationWorker.on("failed", (job, err) => {
  console.error(`Recommendation Job ${job?.id} failed`, err);
});

recommendationWorker.on("error", (err) => {
  console.error("Recommendation Worker Error", err);
});
