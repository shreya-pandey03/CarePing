import { Queue } from "bullmq";
import { connection } from "@/lib/bullmq";

/**
 * Generates AI insights
 */
export const aiQueue = new Queue("ai-insights", {
  connection,

  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 500,

    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 3000,
    },
  },
});

/**
 * Weekly Reports
 */
export const weeklyReportQueue = new Queue("weekly-reports", {
  connection,

  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 100,

    attempts: 3,
  },
});

/**
 * Recommendations
 */
export const recommendationQueue = new Queue("recommendations", {
  connection,

  defaultJobOptions: {
    removeOnComplete: 100,

    attempts: 3,
  },
});

/**
 * Notifications
 */
export const notificationQueue = new Queue("notifications", {
  connection,

  defaultJobOptions: {
    removeOnComplete: 200,
  },
});

/**
 * Streak Updates
 */
export const streakQueue = new Queue("streaks", {
  connection,
});
