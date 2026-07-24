import { redis } from "@/lib/redis";

import type { RealtimeEvent } from "./types";

export async function publishRealtimeEvent<T>(
  channel: string,
  event: RealtimeEvent<T>,
) {
  await redis.publish(channel, JSON.stringify(event));
}
