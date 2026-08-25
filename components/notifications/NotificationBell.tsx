"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Bell, Check, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getNotifications } from "@/actions/notifications/getNotifications";
import { markNotificationRead } from "@/actions/notifications/markNotificationRead";
import { markAllNotificationsRead } from "@/actions/notifications/markAllNotificationsRead";

type Notification = {
  id: string;
  title: string;
  message: string;
  category:
    | "achievement"
    | "motivation"
    | "habit_reminder"
    | "goal_reminder"
    | "weekly_report"
    | "monthly_report"
    | "streak_warning"
    | "recommendation"
    | "reminder";
  isRead: boolean;
  actionUrl: string | null;
  createdAt: Date;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function loadNotifications() {
    const data = await getNotifications();

    setNotifications(data);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  function handleRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);

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

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    });
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleString();
  }

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value) {
          loadNotifications();
        }
      }}
    >
      <PopoverTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="font-semibold">Notifications</h3>

            <p className="text-xs text-muted-foreground">
              {unreadCount} unread
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={isPending}
            >
              <Check className="mr-1 h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

              <p className="font-medium">No notifications</p>

              <p className="mt-1 text-sm text-muted-foreground">
                You are all caught up.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-b px-4 py-3 transition ${
                  notification.isRead ? "bg-background" : "bg-muted/40"
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          notification.isRead ? "font-medium" : "font-semibold"
                        }`}
                      >
                        {notification.title}
                      </p>

                      {!notification.isRead && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleRead(notification.id)}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Mark read
                        </Button>
                      )}

                      {notification.actionUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleRead(notification.id)}
                        >
                          <Link href={notification.actionUrl}>
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Open
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-2">
          <Button variant="ghost" className="w-full">
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
