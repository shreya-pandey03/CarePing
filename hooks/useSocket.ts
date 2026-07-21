"use client";

import { useEffect } from "react";

import { useSocketContext } from "@/components/providers/SocketProvider";
import { SOCKET_EVENTS } from "@/lib/socket/events";
import { useSocketStore } from "@/store/socketStore";

export function useSocket() {
  const socket = useSocketContext();

  const addHabit = useSocketStore((state) => state.addHabit);
  const updateHabit = useSocketStore((state) => state.updateHabit);
  const deleteHabit = useSocketStore((state) => state.deleteHabit);
  const completeHabit = useSocketStore((state) => state.completeHabit);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.HABIT_CREATED, (habit) => {
      addHabit(habit);
    });

    socket.on(SOCKET_EVENTS.HABIT_UPDATED, (habit) => {
      updateHabit(habit);
    });

    socket.on(SOCKET_EVENTS.HABIT_DELETED, (habitId: string) => {
      deleteHabit(habitId);
    });

    socket.on(SOCKET_EVENTS.HABIT_COMPLETED, (data) => {
      completeHabit(data);
    });

    return () => {
      socket.off(SOCKET_EVENTS.HABIT_CREATED);
      socket.off(SOCKET_EVENTS.HABIT_UPDATED);
      socket.off(SOCKET_EVENTS.HABIT_DELETED);
      socket.off(SOCKET_EVENTS.HABIT_COMPLETED);
    };
  }, [socket, addHabit, updateHabit, deleteHabit, completeHabit]);

  return socket;
}
