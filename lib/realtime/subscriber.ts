import Redis from "ioredis";
import { Server } from "socket.io";

import { CHANNELS } from "./channels";
import { userRoom } from "@/lib/socket/rooms";

let subscriber: Redis | null = null;

export async function startRealtimeSubscriber(io: Server) {
  if (subscriber) {
    return subscriber;
  }

  subscriber = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });

  subscriber.on("connect", () => {
    console.log("Realtime subscriber connected");
  });

  subscriber.on("ready", () => {
    console.log("Realtime subscriber ready");
  });

  subscriber.on("error", (err) => {
    console.error("Subscriber Error:", err);
  });

  await subscriber.subscribe(
    CHANNELS.HABIT_CREATED,
    CHANNELS.HABIT_UPDATED,
    CHANNELS.HABIT_COMPLETED,
    CHANNELS.HABIT_DELETED,

    CHANNELS.DASHBOARD_UPDATED,
    CHANNELS.ANALYTICS_UPDATED,
    CHANNELS.INSIGHTS_UPDATED,
    CHANNELS.RECOMMENDATIONS_UPDATED,

    CHANNELS.NOTIFICATION_CREATED,
  );

  console.log("Subscribed to realtime channels");

  subscriber.on("message", (channel, message) => {
    try {
      const event = JSON.parse(message);

      if (!event.userId) {
        console.error("Realtime event missing userId:", event);
        return;
      }

      io.to(userRoom(event.userId)).emit(channel, event.payload);
    } catch (error) {
      console.error("Failed to process realtime message:", error);
    }
  });

  return subscriber;
}