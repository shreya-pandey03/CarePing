"use client";

import { useEffect } from "react";

import { useSocketContext } from "@/components/providers/SocketProvider";
import { useSocketStore } from "@/store/socketStore";

export function useRealtimeHabits() {
  const socket = useSocketContext();
  const addHabit = useSocketStore((state) => state.addHabit);
  const updateHabit = useSocketStore((state) => state.updateHabit);
  const deleteHabit = useSocketStore((state) => state.deleteHabit);
  const completeHabit = useSocketStore((state) => state.completeHabit);

  useEffect(() => {
    socket.on("habit:created", (habit) => {
      addHabit(habit);
    });

    socket.on("habit:updated", (habit) => {
      updateHabit(habit);
    });

    socket.on("habit:deleted", (habitId: string) => {
      deleteHabit(habitId);
    });

    socket.on(
      "habit:completed",
      (data: { habitId: string; streak: number; completion: number }) => {
        completeHabit(data);
      },
    );

    return () => {
      socket.off("habit:created");
      socket.off("habit:updated");
      socket.off("habit:deleted");
      socket.off("habit:completed");
    };
  }, [socket, addHabit, updateHabit, deleteHabit, completeHabit]);
}
