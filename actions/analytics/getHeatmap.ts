"use server";

import { auth } from "@/auth";
import { getHeatmapData } from "@/lib/analytics/heatmap";

export async function getHeatmap() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getHeatmapData(session.user.id);
}
