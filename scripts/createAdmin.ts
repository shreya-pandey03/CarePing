import { db } from "@/lib/db";

import { users } from "@/drizzle/schema";

async function createAdmin() {
  try {
    const admin = {
      id: "system",
      name: "System",
      email: "system@habitly.local",
      image: null,
    };

    await db
      .insert(users)
      .values(admin)
      .onConflictDoNothing();

    console.log(
      "System user created successfully."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to create system user:",
      error
    );

    process.exit(1);
  }
}

createAdmin();