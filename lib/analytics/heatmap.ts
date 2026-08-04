import { db } from "@/lib/db";
import { habitLogs, habits } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function getHeatmapData(userId: string) {
  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const userHabits = await db.query.habits.findMany({
    where: and(eq(habits.userId, userId), eq(habits.active, true)),
  });

  const totalHabits = userHabits.length;

  const heatmap = new Map<
    string,
    {
      count: number;
      completionRate: number;
    }
  >();

  logs.forEach((log) => {
    const date = log.completedAt.toISOString().split("T")[0];

    const current = heatmap.get(date) ?? {
      count: 0,

      completionRate: 0,
    };

    current.count += 1;

    heatmap.set(date, current);
  });

  const result = Array.from(heatmap.entries()).map(([date, value]) => ({
    date,

    count: value.count,

    completionRate:
      totalHabits === 0 ? 0 : Math.round((value.count / totalHabits) * 100),
  }));

  return result;
}
