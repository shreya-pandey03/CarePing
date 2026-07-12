import { db } from "@/lib/db";

import { badges } from "@/drizzle/schema";

import { BADGES } from "@/constants/badges";

async function seedBadges() {
  try {
    await db
      .insert(badges)
      .values(
        BADGES.map((badge) => ({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          rarity: badge.rarity,
          requiredValue: badge.requiredValue,
        }))
      )
      .onConflictDoNothing();

    console.log(
      "Badges seeded successfully"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed badges:",
      error
    );

    process.exit(1);
  }
}

seedBadges();