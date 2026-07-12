"use client";

import { useState } from "react";

import { Bell, Brain, Calendar, Flame, Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    dailyReminder: true,
    aiInsights: true,
    weeklyReports: true,
    monthlyReports: true,
    streakAlerts: true,
    emailNotifications: false,
  });

  function toggle<K extends keyof typeof settings>(key: K) {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>

        <CardDescription>
          Choose which notifications you would like to receive.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5" />

            <div>
              <Label>Daily Habit Reminder</Label>

              <p className="text-sm text-muted-foreground">
                Receive reminders to complete your habits.
              </p>
            </div>
          </div>

          <Switch
            checked={settings.dailyReminder}
            onCheckedChange={() => toggle("dailyReminder")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5" />

            <div>
              <Label>AI Insights</Label>

              <p className="text-sm text-muted-foreground">
                Notify me when new AI insights are available.
              </p>
            </div>
          </div>

          <Switch
            checked={settings.aiInsights}
            onCheckedChange={() => toggle("aiInsights")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />

            <div>
              <Label>Weekly Reports</Label>

              <p className="text-sm text-muted-foreground">
                Receive AI-generated weekly reports.
              </p>
            </div>
          </div>

          <Switch
            checked={settings.weeklyReports}
            onCheckedChange={() => toggle("weeklyReports")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />

            <div>
              <Label>Monthly Reports</Label>

              <p className="text-sm text-muted-foreground">
                Receive AI-generated monthly reports.
              </p>
            </div>
          </div>

          <Switch
            checked={settings.monthlyReports}
            onCheckedChange={() => toggle("monthlyReports")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5" />

            <div>
              <Label>Streak Alerts</Label>

              <p className="text-sm text-muted-foreground">
                Be notified when your streak is at risk.
              </p>
            </div>
          </div>

          <Switch
            checked={settings.streakAlerts}
            onCheckedChange={() => toggle("streakAlerts")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5" />

            <div>
              <Label>Email Notifications</Label>

              <p className="text-sm text-muted-foreground">
                Send important updates to my email.
              </p>
            </div>
          </div>

          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={() => toggle("emailNotifications")}
          />
        </div>

        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  );
}
