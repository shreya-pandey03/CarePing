"use client";

import {
  Bell,
  CheckCircle2,
  Flame,
  Lightbulb,
  Target,
  Trophy,
  FileText,
  Trash2,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type NotificationItem = {
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
  notification: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryConfig = {
  achievement: {
    label: "Achievement",
    icon: Trophy,
  },

  motivation: {
    label: "Motivation",
    icon: Lightbulb,
  },

  habit_reminder: {
    label: "Habit Reminder",
    icon: Bell,
  },

  goal_reminder: {
    label: "Goal Reminder",
    icon: Target,
  },

  weekly_report: {
    label: "Weekly Report",
    icon: FileText,
  },

  monthly_report: {
    label: "Monthly Report",
    icon: FileText,
  },

  streak_warning: {
    label: "Streak Warning",
    icon: Flame,
  },

  recommendation: {
    label: "Recommendation",
    icon: Lightbulb,
  },

  reminder: {
    label: "Reminder",
    icon: Bell,
  },
} as const;

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: Props) {
  const config = categoryConfig[notification.category];

  const Icon = config?.icon ?? Bell;

  return (
    <Card
      className={`transition ${
        notification.isRead
          ? "opacity-70"
          : "border-primary/30 bg-primary/[0.03]"
      }`}
    >
      <CardContent className="flex gap-4 p-5">
        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            notification.isRead ? "bg-muted" : "bg-primary/10"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{notification.title}</h3>

                {!notification.isRead && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>

              <Badge variant="secondary" className="mt-2">
                {config?.label ?? "Notification"}
              </Badge>
            </div>

            <span className="text-xs text-muted-foreground">
              {formatDate(notification.createdAt)}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {notification.message}
          </p>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {!notification.isRead && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as read
              </Button>
            )}

            {notification.actionUrl && (
              <Button size="sm" variant="outline">
                <a href={notification.actionUrl}>View</a>
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
