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
      delay: 5000,
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

    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

/**
 * Recommendations
 */
export const recommendationQueue = new Queue("recommendations", {
  connection,

  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 500,

    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

/**
 * Notifications
 */
export const notificationQueue = new Queue("notifications", {
  connection,

  defaultJobOptions: {
    removeOnComplete: 200,
    removeOnFail: 100,
  },
});

/**
 * Streak Updates
 */
export const streakQueue = new Queue("streaks", {
  connection,

  defaultJobOptions: {
    removeOnComplete: {
      age: 3600,
      count: 100,
    },

    removeOnFail: {
      age: 86400,
      count: 100,
    },

    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 3000,
    },
  },
});

/**
 * Monthly Reports
 */
export const monthlyReportQueue = new Queue("monthly-reports", {
  connection,

  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 100,

    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});
