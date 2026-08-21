import { eq, and, gte, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import { habits, habitLogs, streaks, weeklyReports } from "@/drizzle/schema";

export async function generateWeeklyReport(userId: string) {
  const now = new Date();

  // WEEK RANGE

  const weekEnd = new Date(now);
  weekEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  // FETCH DATA

  const [userHabits, logs, userStreaks] = await Promise.all([
    db.query.habits.findMany({
      where: eq(habits.userId, userId),
    }),

    db.query.habitLogs.findMany({
      where: and(
        eq(habitLogs.userId, userId),
        gte(habitLogs.completedAt, weekStart),
        lte(habitLogs.completedAt, weekEnd),
      ),
    }),

    db.query.streaks.findMany({
      where: eq(streaks.userId, userId),
    }),
  ]);

  // NO HABITS

  if (userHabits.length === 0) {
    return null;
  }

  // Only completed logs
  const weeklyLogs = logs.filter((log) => log.completed);

  const totalHabits = userHabits.length;

  // POSSIBLE COMPLETIONS

  let possibleCompletions = 0;

  for (const habit of userHabits) {
    if (habit.frequency === "daily") {
      possibleCompletions += 7;
    } else if (habit.frequency === "weekly") {
      possibleCompletions += 1;
    } else if (habit.frequency === "monthly") {
      possibleCompletions += 1;
    }
  }

  // COMPLETION RATE

  const completedActivities = weeklyLogs.length;

  const completionRate =
    possibleCompletions > 0
      ? Math.min(
          100,
          Math.round((completedActivities / possibleCompletions) * 100),
        )
      : 0;

  // STRONGEST HABIT

  const strongestHabit = userHabits
    .map((habit) => {
      const streak = userStreaks.find((item) => item.habitId === habit.id);

      const completedCount = weeklyLogs.filter(
        (log) => log.habitId === habit.id,
      ).length;

      return {
        title: habit.title,
        streak: streak?.currentStreak ?? 0,
        completedCount,
      };
    })
    .sort((a, b) => {
      if (b.streak !== a.streak) {
        return b.streak - a.streak;
      }

      return b.completedCount - a.completedCount;
    })[0];

  // WEAKEST HABIT

  const weakestHabit = userHabits
    .map((habit) => {
      const completedCount = weeklyLogs.filter(
        (log) => log.habitId === habit.id,
      ).length;

      return {
        title: habit.title,
        completedCount,
      };
    })
    .sort((a, b) => a.completedCount - b.completedCount)[0];

  // BEST STREAK

  const bestStreak =
    userStreaks.length > 0
      ? Math.max(...userStreaks.map((streak) => streak.longestStreak))
      : 0;

  // TITLE

  const title =
    completionRate >= 90
      ? "Excellent Week"
      : completionRate >= 75
        ? "Strong Week"
        : completionRate >= 50
          ? "Good Progress"
          : "Keep Building";

  // SUMMARY

  const summary =
    completionRate >= 90
      ? "Excellent consistency this week. Keep protecting your current momentum."
      : completionRate >= 75
        ? "You made strong progress this week. A little more consistency can make your habits even stronger."
        : completionRate >= 50
          ? "You are making progress. Focus on completing your habits consistently each day."
          : "This week was challenging, but every completed habit is progress. Focus on rebuilding your routine.";

  // STRENGTHS

  const strengths: string[] = [];

  if (strongestHabit) {
    strengths.push(
      `${strongestHabit.title} reached a ${strongestHabit.streak}-day streak.`,
    );
  }

  strengths.push(
    `You completed ${completedActivities} habit activities this week.`,
  );

  if (bestStreak > 0) {
    strengths.push(`Your best recorded streak is ${bestStreak} days.`);
  }
  // IMPROVEMENTS

  const improvements: string[] = [];

  if (weakestHabit) {
    improvements.push(`${weakestHabit.title} needs more consistency.`);
  }

  improvements.push(
    "Try completing your habits around the same time each day.",
  );

  if (completionRate < 75) {
    improvements.push(
      "Focus on completing one important habit before adding more tasks.",
    );
  }

  // RECOMMENDATIONS

  const recommendations = [
    "Protect your strongest streak.",
    "Focus on your weakest habit first.",
    "Keep your daily routine simple and consistent.",
  ];

  // SAVE REPORT

  const [report] = await db
    .insert(weeklyReports)
    .values({
      userId,
      weekStart,
      weekEnd,
      completionRate,
      totalHabits,

      // Number of actual completed habit activities
      completedHabits: completedActivities,

      title,
      summary,
      strengths,
      improvements,
      recommendations,
    })
    .returning();

  return report;
}
