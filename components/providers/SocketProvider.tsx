"use client";

import { createContext, useContext, useEffect } from "react";
import type { Socket } from "socket.io-client";

import { getSocket } from "@/lib/socket";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = getSocket();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");

      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocketContext() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocketContext must be inside SocketProvider");
  }

  return socket;
}
