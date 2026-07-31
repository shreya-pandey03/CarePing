import { habitLogs, habits } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq, gte } from "drizzle-orm";

export async function getCompletionHistory(userId: string, days: number) {
  const today = new Date();

  const startDate = new Date();

  startDate.setDate(today.getDate() - (days - 1));

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
  });

  const logs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.userId, userId),
      gte(habitLogs.completedAt, startDate),
    ),
  });

  const totalHabits = Math.max(userHabits.length, 1);

  const history = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + i);

    const completed = logs.filter((log) => {
      return log.completedAt.toDateString() === date.toDateString();
    }).length;

    history.push({
      date: date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),

      completed,

      completionRate: Math.round((completed / totalHabits) * 100),
    });
  }

  return history;
}
