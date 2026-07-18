import { createServer } from "node:http";
import { Server } from "socket.io";

import { registerSocketHandlers } from "@/lib/socket/handlers";

const PORT = Number(process.env.SOCKET_PORT ?? 3001);

let io: Server | null = null;

export function startSocketServer() {
  if (io) {
    return io;
  }

  const httpServer = createServer();

  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    registerSocketHandlers(io!, socket);

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Socket running on ${PORT}`);
  });

  return io;
}

export function getSocketServer() {
  if (!io) {
    throw new Error(
      "Socket server has not been started. Call startSocketServer() first.",
    );
  }

  return io;
}

if (require.main === module) {
  startSocketServer();
}
