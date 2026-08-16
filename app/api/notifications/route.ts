import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.user.id),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
      limit: 20,
    });

    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error("NOTIFICATIONS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
