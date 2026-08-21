"use client";

import { useState, useTransition } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import NotificationCard, { type NotificationItem } from "./NotificationCard";

import { markNotificationAsRead } from "@/actions/notifications/markAsRead";
import { markAllNotificationsAsRead } from "@/actions/notifications/markAllAsRead";
import { deleteNotification } from "@/actions/notifications/deleteNotification";

interface Props {
  initialNotifications: NotificationItem[];
}

export default function NotificationList({ initialNotifications }: Props) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const [isPending, startTransition] = useTransition();

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  function handleMarkAsRead(id: string) {
    startTransition(async () => {
      await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    });
  }

  function handleMarkAllAsRead() {
    if (unreadCount === 0) {
      return;
    }

    startTransition(async () => {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteNotification(id);

      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );
    });
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Bell className="h-6 w-6 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">No notifications yet</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Your habit reminders, achievements, streak warnings and AI
          recommendations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {unreadCount === 0
              ? "You're all caught up."
              : `${unreadCount} unread notification${
                  unreadCount === 1 ? "" : "s"
                }`}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
