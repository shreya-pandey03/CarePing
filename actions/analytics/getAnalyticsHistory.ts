"use server";

import { auth } from "@/auth";
import { getCompletionHistory } from "@/lib/analytics-history";

export async function getWeeklyHistory() {
  const session = await auth();

  if (!session?.user?.id) return [];

  return getCompletionHistory(session.user.id, 7);
}

export async function getMonthlyHistory() {
  const session = await auth();

  if (!session?.user?.id) return [];

  return getCompletionHistory(session.user.id, 30);
}
