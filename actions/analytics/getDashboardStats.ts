"use server";

import { auth } from "@/auth";
import { getDashboardAnalytics } from "@/lib/analytics/dashboard";

export async function getDashboardStats() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getDashboardAnalytics(session.user.id);
}