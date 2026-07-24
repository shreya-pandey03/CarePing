"use client";

import { createContext, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";

import type { Socket } from "socket.io-client";

import { getSocket } from "@/lib/socket";
import { useSocketStore } from "@/store/socketStore";

import { SOCKET_EVENTS } from "@/lib/socket/events";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = getSocket();

  const { data: session } = useSession();

  const { setConnected, addHabit, updateHabit, deleteHabit, completeHabit } =
    useSocketStore();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      setConnected(true);

      if (session?.user?.id) {
        socket.emit(SOCKET_EVENTS.JOIN_USER, session.user.id);

        console.log("Joined user room:", session.user.id);
      }
    });

    socket.on("habit.created", (habit) => {
      addHabit(habit);
    });

    socket.on("habit.updated", (habit) => {
      updateHabit(habit);
    });

    socket.on("habit.deleted", ({ habitId }) => {
      deleteHabit(habitId);
    });

    socket.on("habit.completed", ({ habitId, streak, completion }) => {
      completeHabit({
        habitId,
        streak,
        completion,
      });
    });

    return () => {
      socket.off("connect");
      socket.off("habit.created");
      socket.off("habit.updated");
      socket.off("habit.deleted");
      socket.off("habit.completed");
    };
  }, [session]);

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
