import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

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

  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    userId,
    title: ` ${streak}-Day Streak!`,
    message: `Amazing! You completed "${habitTitle}" for ${streak} days in a row.`,
    category: "achievement",
    actionUrl: `/habits/${habitId}`,
  });
}
