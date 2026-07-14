import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { notifications } from "@/drizzle/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, CheckCircle2 } from "lucide-react";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userNotifications = await db.query.notifications.findMany({
    where: eq(notifications.userId, session.user.id),
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>

        <p className="text-muted-foreground">
          Stay informed about reminders, streaks, AI insights, and habit
          activity.
        </p>
      </div>

      {userNotifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-xl font-semibold">No Notifications</h2>

            <p className="mt-2 text-muted-foreground">You're all caught up.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userNotifications.map((notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{notification.title}</CardTitle>

                  <Badge
                    variant={notification.isRead ? "secondary" : "default"}
                  >
                    {notification.isRead ? "Read" : "Unread"}
                  </Badge>
                </div>

                <CardDescription>{notification.category}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="leading-7 text-muted-foreground">
                  {notification.message}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />

                    {notification.createdAt.toLocaleDateString()}
                  </div>

                  {notification.sentAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Sent
                    </div>
                  )}
                </div>

                {notification.actionUrl && (
                  <a
                    href={notification.actionUrl}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Open →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
