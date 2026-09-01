"use server";

import { auth } from "@/auth";
import { generateAIInsights } from "@/lib/ai/generateAIInsights";
import { saveAIInsights } from "@/lib/ai/saveAIInsights";

export async function generateFreshAIInsights() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await generateAIInsights();

  await saveAIInsights(result);
  
  return result;
}