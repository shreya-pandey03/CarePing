import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Bell } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

import NotificationList from "@/components/notifications/NotificationList";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userNotifications = await db
    .select({
      id: notifications.id,
      title: notifications.title,
      message: notifications.message,
      category: notifications.category,
      isRead: notifications.isRead,
      actionUrl: notifications.actionUrl,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt));

  const formattedNotifications = userNotifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    category: notification.category,
    isRead: notification.isRead,
    actionUrl: notification.actionUrl,
    createdAt: notification.createdAt,
  }));

  const unreadCount = formattedNotifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>

              <p className="mt-1 text-muted-foreground">
                Stay updated with your habits, goals and AI coach.
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            {unreadCount} unread
          </div>
        )}
      </div>

      {/* Notification List */}
      <NotificationList initialNotifications={formattedNotifications} />
    </div>
  );
}
