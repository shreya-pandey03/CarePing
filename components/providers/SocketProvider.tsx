"use client";

import { createContext, useContext, useEffect } from "react";
import type { Socket } from "socket.io-client";
import { useSocketStore } from "@/store/socketStore";
import { getSocket } from "@/lib/socket";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = getSocket();
  const { setConnected, addHabit, updateHabit, deleteHabit, completeHabit } =
    useSocketStore();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("habit:created", (habit) => {
      addHabit(habit);
    });

    socket.on("habit:updated", (habit) => {
      updateHabit(habit);
    });

    socket.on("habit:deleted", ({ id }) => {
      deleteHabit(id);
    });

    socket.on("habit:completed", (data) => {
      completeHabit(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("habit:created");
      socket.off("habit:updated");
      socket.off("habit:deleted");
      socket.off("habit:completed");
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
