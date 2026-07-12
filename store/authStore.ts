"use client";

import { create } from "zustand";

import type { AuthUser } from "@/types/user";

interface AuthState {
  user: AuthUser | null;

  loading: boolean;

  setUser: (user: AuthUser | null) => void;

  setLoading: (loading: boolean) => void;

  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  loading: true,

  setUser: (user) =>
    set({
      user,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  clearUser: () =>
    set({
      user: null,
    }),
}));
