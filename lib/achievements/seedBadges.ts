import { db } from "@/lib/db";
import { badges } from "@/drizzle/schema";

const badgeDefinitions = [
  {
    id: "first-step",
    name: "First Step",
    description: "Complete your first habit.",
    icon: "🌱",
    rarity: "common" as const,
    requiredValue: 1,
  },
  {
    id: "seven-day-streak",
    name: "7 Day Streak",
    description: "Maintain a habit streak for 7 days.",
    icon: "🔥",
    rarity: "rare" as const,
    requiredValue: 7,
  },
  {
    id: "fourteen-day-streak",
    name: "14 Day Streak",
    description: "Maintain a habit streak for 14 days.",
    icon: "🔥",
    rarity: "rare" as const,
    requiredValue: 14,
  },
  {
    id: "thirty-day-streak",
    name: "30 Day Streak",
    description: "Maintain a habit streak for 30 days.",
    icon: "🏆",
    rarity: "epic" as const,
    requiredValue: 30,
  },
  {
    id: "fifty-completions",
    name: "50 Completions",
    description: "Complete habits 50 times.",
    icon: "⭐",
    rarity: "epic" as const,
    requiredValue: 50,
  },
  {
    id: "hundred-completions",
    name: "100 Completions",
    description: "Complete habits 100 times.",
    icon: "💎",
    rarity: "legendary" as const,
    requiredValue: 100,
  },
];

export async function seedBadges() {
  for (const badge of badgeDefinitions) {
    await db.insert(badges).values(badge).onConflictDoNothing();
  }
}
