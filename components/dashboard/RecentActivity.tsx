"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { CheckCircle2, Bell, Flame, Sparkles } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: "habit" | "streak" | "notification" | "ai";
  createdAt: Date;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "habit":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;

      case "streak":
        return <Flame className="h-5 w-5 text-orange-500" />;

      case "notification":
        return <Bell className="h-5 w-5 text-blue-500" />;

      case "ai":
        return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  const getBadge = (type: ActivityItem["type"]) => {
    switch (type) {
      case "habit":
        return <Badge variant="default">Habit</Badge>;

      case "streak":
        return <Badge variant="secondary">Streak</Badge>;

      case "notification":
        return <Badge variant="outline">Notification</Badge>;

      case "ai":
        return <Badge>AI</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="flex gap-3">
                  {getIcon(activity.type)}

                  <div>
                    <h4 className="font-medium">{activity.title}</h4>

                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>

                {getBadge(activity.type)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
