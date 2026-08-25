import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import NotificationCard from "@/components/notifications/NotificationCard";

import MarkAllAsReadButton from "@/components/notifications/MarkAllAsReadButton";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userNotifications = await db.query.notifications.findMany({
    where: eq(notifications.userId, session.user.id),
    orderBy: [desc(notifications.createdAt)],
  });

  const unreadCount = userNotifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>

          <p className="mt-2 text-muted-foreground">
            Stay updated with your habits, goals and AI coach.
          </p>
        </div>

        {unreadCount > 0 && <MarkAllAsReadButton />}
      </div>

      {userNotifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">No notifications yet</h2>

            <p className="mt-2 text-muted-foreground">
              Your habit reminders, achievements, streak warnings and AI
              recommendations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
}
