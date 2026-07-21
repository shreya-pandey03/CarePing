"use client";

import { useState } from "react";

import { createHabit } from "@/actions/createHabit";
import { updateHabit } from "@/actions/updateHabit";
import { deleteHabit } from "@/actions/deleteHabit";

import type { HabitFormValues } from "@/types/habit";

import { useSocketStore } from "@/store/socketStore";
import { completeHabit as completeHabitAction } from "@/actions/completeHabit";

export function useHabits() {
  const habits = useSocketStore((state) => state.habits);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function addHabit(values: HabitFormValues) {
    try {
      setLoading(true);

      await createHabit(values);

      // Socket.IO updates Zustand automatically
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create habit",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function editHabit(id: string, values: HabitFormValues) {
    try {
      setLoading(true);

      await updateHabit({
        id,
        ...values,
      });

      // Socket.IO updates Zustand automatically
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update habit",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }

async function removeHabit(id:string) {
  try {

    setLoading(true);

    console.log("HOOK DELETE:", id);

    await deleteHabit(id);

    console.log("DELETE ACTION FINISHED");

  } catch(error){

    console.error("DELETE ERROR:",error);

    throw error;

  } finally {

    setLoading(false);

  }
}

async function completeHabit(id: string) {
  try {
    setLoading(true);

    console.log("HOOK COMPLETE:", id);

    await completeHabitAction(id);

    console.log("COMPLETE ACTION FINISHED");

  } catch (error) {

    console.error("COMPLETE ERROR:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Failed to complete habit"
    );

    throw error;

  } finally {
    setLoading(false);
  }
}

  return {
    habits,
    loading,
    error,

    addHabit,
    editHabit,
    removeHabit,
    completeHabit,
  };
}
