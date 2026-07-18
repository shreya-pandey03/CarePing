"use client";

import { useEffect } from "react";

import { useSocket } from "./useSocket";

export function useSocketRoom(userId: string) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket.connected) return;

    socket.emit("join-user-room", userId);
  }, [socket, userId]);
}
