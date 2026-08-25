import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  badges,
  habitLogs,
  userBadges,
} from "@/drizzle/schema";

type AchievementInput = {
  userId: string;
  currentStreak: number;
  longestStreak: number;
};

export async function checkAchievements({
  userId,
  currentStreak,
  longestStreak,
}: AchievementInput) {
  const earnedBadges = await db.query.userBadges.findMany({
    where: eq(userBadges.userId, userId),
  });

  const earnedBadgeIds = new Set(
    earnedBadges.map((badge) => badge.badgeId),
  );

  const allBadges = await db.query.badges.findMany();

  const completedLogs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.userId, userId),
      eq(habitLogs.completed, true),
    ),
  });

  const totalCompletions = completedLogs.length;

  const unlockedBadges = [];

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) {
      continue;
    }

    let qualifies = false;

    switch (badge.id) {
      case "first-step":
        qualifies = totalCompletions >= 1;
        break;

      case "seven-day-streak":
        qualifies = longestStreak >= 7;
        break;

      case "fourteen-day-streak":
        qualifies = longestStreak >= 14;
        break;

      case "thirty-day-streak":
        qualifies = longestStreak >= 30;
        break;

      case "fifty-completions":
        qualifies = totalCompletions >= 50;
        break;

      case "hundred-completions":
        qualifies = totalCompletions >= 100;
        break;
    }

    if (!qualifies) {
      continue;
    }

    const inserted = await db
      .insert(userBadges)
      .values({
        id: crypto.randomUUID(),
        userId,
        badgeId: badge.id,
      })
      .onConflictDoNothing()
      .returning();

    if (inserted.length > 0) {
      unlockedBadges.push(badge);
    }
  }

  return unlockedBadges;
}