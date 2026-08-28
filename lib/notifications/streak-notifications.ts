import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";
import { createNotification } from "@/lib/notifications/createNotification";
const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100];

export async function createStreakMilestoneNotification({
  userId,
  habitId,
  habitTitle,
  streak,
}: {
  userId: string;
  habitId: string;
  habitTitle: string;
  streak: number;
}) {
  if (!STREAK_MILESTONES.includes(streak)) {
    return;
  }

  await createNotification({
    userId,
    title: "Goal Completed!",
    message: `Congratulations! Your habit "${habitTitle}" reached a ${streak}-day streak.`,
    category: "achievement",
    actionUrl: "/goals",
  });
}
