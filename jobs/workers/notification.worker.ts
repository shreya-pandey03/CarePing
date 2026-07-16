import { Worker, Job } from "bullmq";
import { and, eq } from "drizzle-orm";

import { connection } from "@/lib/bullmq";
import { db } from "@/lib/db";

import { habits, habitLogs, notifications } from "@/drizzle/schema";

interface NotificationJobData {
  userId: string;
}

export const notificationWorker = new Worker<NotificationJobData>(
  "notifications",

  async (job: Job<NotificationJobData>) => {
    try {
      const { userId } = job.data;

      console.log(`Checking reminders for ${userId}`);

      // Today's Range

      const today = new Date();

      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      // Load Habits

      const userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
      });

      // Check Every Habit

      for (const habit of userHabits) {
        const completed = await db.query.habitLogs.findFirst({
          where: and(
            eq(habitLogs.userId, userId),
            eq(habitLogs.habitId, habit.id),
          ),
        });

        let completedToday = false;

        if (completed) {
          completedToday =
            completed.completedAt >= startOfDay &&
            completed.completedAt <= endOfDay;
        }

        if (completedToday) {
          continue;
        }

        // Create Reminder

        await db.insert(notifications).values({
          id: crypto.randomUUID(),
          userId,
          title: "Habit Reminder",
          message: `Don't forget to complete "${habit.title}" today.`,
          category: "habit_reminder",
          actionUrl: `/habits/${habit.id}`,
          scheduledFor: new Date(),
          sentAt: new Date(),
        });
      }

      console.log(`Notifications generated`);

      return {
        success: true,
      };
    } catch (error) {
      console.error("Notification Worker Error", error);

      throw error;
    }
  },

  {
    connection,

    concurrency: 5,
  },
);

notificationWorker.on("completed", (job) => {
  console.log(`Notification Job ${job.id} completed`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`Notification Job ${job?.id} failed`, err);
});

notificationWorker.on("error", (err) => {
  console.error("Notification Worker Error", err);
});
