"use client";

import { useEffect } from "react";

import { useSocket } from "@/hooks/useSocket";

import { SOCKET_EVENTS } from "@/lib/socket/events";

import { useRealtimeStore } from "@/store/realtimeStore";

interface DashboardRealtimeProps {
  userId: string;
}

export default function DashboardRealtime({ userId }: DashboardRealtimeProps) {
  const socket = useSocket();

  const { addHabit, updateHabit, removeHabit, completeHabit } =
    useRealtimeStore();

  useEffect(() => {
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.JOIN_USER, userId);

    socket.on(SOCKET_EVENTS.HABIT_CREATED, addHabit);

    socket.on(SOCKET_EVENTS.HABIT_UPDATED, updateHabit);

    socket.on(SOCKET_EVENTS.HABIT_COMPLETED, (data: { habitId: string }) => {
      completeHabit(data.habitId);
    });

    socket.on(SOCKET_EVENTS.HABIT_DELETED, (data: { id: string }) => {
      removeHabit(data.id);
    });

    return () => {
      socket.off(SOCKET_EVENTS.HABIT_CREATED);

      socket.off(SOCKET_EVENTS.HABIT_UPDATED);

      socket.off(SOCKET_EVENTS.HABIT_COMPLETED);

      socket.off(SOCKET_EVENTS.HABIT_DELETED);
    };
  }, [socket, userId, addHabit, updateHabit, removeHabit, completeHabit]);

  return null;
}
