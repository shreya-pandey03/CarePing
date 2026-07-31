"use server";

import { auth } from "@/auth";
import { getMonthlyAnalytics } from "@/lib/analytics/monthly";

export async function getMonthlyStats() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getMonthlyAnalytics(session.user.id);
}