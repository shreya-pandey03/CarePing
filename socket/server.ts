import { createServer } from "node:http";
import { Server } from "socket.io";

import { registerSocketHandlers } from "@/lib/socket/handlers";

const PORT = Number(process.env.SOCKET_PORT ?? 3001);

export function startSocketServer() {
  const httpServer = createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    registerSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Socket running on ${PORT}`);
  });

  return io;
}

startSocketServer();
