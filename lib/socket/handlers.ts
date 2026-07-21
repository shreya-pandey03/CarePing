import type { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "./events";
import { userRoom } from "./rooms";


export function registerSocketHandlers(io: Server, socket: Socket) {
  socket.on(SOCKET_EVENTS.JOIN_USER, (userId: string) => {
    socket.join(userRoom(userId));
  });
}
