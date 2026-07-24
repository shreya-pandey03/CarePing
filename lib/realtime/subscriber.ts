import Redis from "ioredis";

import { CHANNELS } from "./channels";
import { userRoom } from "@/lib/socket/rooms";
import { Server } from "socket.io";

let subscriber: Redis | null = null;

export async function startRealtimeSubscriber(io: Server) {
  if (subscriber) {
    return subscriber;
  }

  subscriber = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });

  subscriber.on("connect", () => {
    console.log(" Realtime subscriber connected");
  });

  subscriber.on("ready", () => {
    console.log(" Realtime subscriber ready");
  });

  subscriber.on("error", (err) => {
    console.error(" Subscriber Error:", err);
  });

  await subscriber.subscribe(
    CHANNELS.HABIT_CREATED,
    CHANNELS.HABIT_UPDATED,
    CHANNELS.HABIT_COMPLETED,
    CHANNELS.HABIT_DELETED,
  );

  console.log(" Subscribed to realtime channels");

  subscriber.on("message", (channel, message) => {
    const event = JSON.parse(message);
    io.to(userRoom(event.userId)).emit(channel, event.payload);
  });

  return subscriber;
}
