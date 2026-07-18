"use client";

import { useEffect } from "react";

import { useSocketContext } from "@/components/providers/SocketProvider";

export function useRealtimeHabits() {
  const socket = useSocketContext();

  useEffect(() => {
    socket.on("habit:completed", (data) => {
      console.log("Realtime habit update", data);

      // update zustand here
      // refresh dashboard data here
    });

    return () => {
      socket.off("habit:completed");
    };
  }, [socket]);
}
