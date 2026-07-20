import type { Server } from "socket.io";

import { SOCKET_EVENTS } from "./events";
import { userRoom } from "./rooms";

export function emitToUser(
  io: Server,
  userId: string,
  event: string,
  data: unknown,
) {
  io.to(userRoom(userId)).emit(event, data);
}
export function emitHabitCreated(io: Server, userId: string, habit: unknown) {
  emitToUser(io, userId, SOCKET_EVENTS.HABIT_CREATED, habit);
}

export function emitHabitUpdated(io: Server, userId: string, habit: unknown) {
  emitToUser(io, userId, SOCKET_EVENTS.HABIT_UPDATED, habit);
}

export function emitHabitCompleted(io: Server, userId: string, habit: unknown) {
  emitToUser(io, userId, SOCKET_EVENTS.HABIT_COMPLETED, habit);
}

export function emitHabitDeleted(io: Server, userId: string, habitId: string) {
  emitToUser(io, userId, SOCKET_EVENTS.HABIT_DELETED, {
    id: habitId,
  });
}
