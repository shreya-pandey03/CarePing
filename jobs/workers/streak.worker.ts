import { Worker, Job } from "bullmq";
import { eq } from "drizzle-orm";
import { connection } from "@/lib/bullmq";
import { db } from "@/lib/db";
import { habitLogs, streaks } from "@/drizzle/schema";
import { calculateStreaks } from "@/lib/streakCalculator";
import { asc } from "drizzle-orm";
interface StreakJobData {
  userId: string;
  habitId: string;
}

export const streakWorker = new Worker<StreakJobData>(
  "streaks",
  async (job: Job<StreakJobData>) => {
    const { habitId, userId } = job.data;
    console.log(`Processing streak for ${habitId}`);
    const logs = await db.query.habitLogs.findMany({
      where: eq(habitLogs.habitId, habitId),
      orderBy: [asc(habitLogs.completedAt)],
    });

    const { currentStreak, longestStreak } = calculateStreaks(logs);

    const existing = await db.query.streaks.findFirst({
      where: eq(streaks.habitId, habitId),
    });

    if (existing) {
      await db
        .update(streaks)
        .set({
          currentStreak,
          longestStreak,
          updatedAt: new Date(),
        })
        .where(eq(streaks.habitId, habitId));
    } else {
      await db.insert(streaks).values({
        id: crypto.randomUUID(),
        habitId,
        currentStreak,
        longestStreak,
      });
    }
    console.log(`Finished streak for ${habitId}`);
    return {
      success: true,
    };
  },
  {
    connection,
    concurrency: 5,
  },
);

streakWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

streakWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});

streakWorker.on("error", (err) => {
  console.error("Worker Error", err);
});
