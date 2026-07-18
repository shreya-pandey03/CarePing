"use client";

import { useSocketRoom } from "@/hooks/useSocketRoom";

export default function DashboardRealtime({ userId }: { userId: string }) {
  useSocketRoom(userId);

  return null;
}
