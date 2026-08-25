"use client";

import { useTransition } from "react";
import { Check, Trash2, Bell } from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { markNotificationAsRead } from "@/actions/notifications/markAsRead";
import { deleteNotification } from "@/actions/notifications/deleteNotification";

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

interface Props {
  notification: Notification;
}

export default function NotificationCard({ notification }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function handleRead() {
    startTransition(async () => {
      await markNotificationAsRead(notification.id);

      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteNotification(notification.id);

      router.refresh();
    });
  }

  function handleOpen() {
    if (!notification.isRead) {
      startTransition(async () => {
        await markNotificationAsRead(notification.id);

        if (notification.actionUrl) {
          router.push(notification.actionUrl);
        } else {
          router.refresh();
        }
      });

      return;
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  }

  return (
    <div
      className={`rounded-xl border p-5 transition ${
        notification.isRead ? "bg-background" : "bg-primary/5 border-primary/20"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 rounded-full bg-muted p-2">
          <Bell className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{notification.title}</h3>

              <Badge variant="secondary" className="mt-2 capitalize">
                {notification.category.replace("_", " ")}
              </Badge>
            </div>

            {!notification.isRead && (
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {notification.message}
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            {notification.createdAt.toLocaleString()}
          </p>

          <div className="mt-4 flex gap-2">
            {notification.actionUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpen}
                disabled={isPending}
              >
                Open
              </Button>
            )}

            {!notification.isRead && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRead}
                disabled={isPending}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as read
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
