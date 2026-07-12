"use client";

import { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationAsRead,
} from "@/actions/notifications";

import type { Notification } from "@/types/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function fetchNotifications() {
    try {
      setLoading(true);

      setError(null);

      const data = await getNotifications();

      setNotifications(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,

    unreadCount,

    loading,

    error,

    refresh: fetchNotifications,

    markAsRead,
  };
}
