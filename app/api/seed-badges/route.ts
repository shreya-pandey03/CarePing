import { NextResponse } from "next/server";

import { seedBadges } from "@/lib/achievements/seedBadges";

export async function GET() {
  await seedBadges();

  return NextResponse.json({
    success: true,
    message: "Badges seeded",
  });
}
