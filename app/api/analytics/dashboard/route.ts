import { getDashboardStats } from "@/actions/analytics/getDashboardStats";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await getDashboardStats();

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
}
