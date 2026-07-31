import { db } from "@/lib/db";
import { habitLogs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getHeatmapData(userId: string) {
  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.userId, userId),
  });

  const map = new Map<string, number>();

  logs.forEach((log) => {
    const date = log.completedAt.toISOString().split("T")[0];

    map.set(date, (map.get(date) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([date, count]) => ({
    date,
    count,
  }));
}
