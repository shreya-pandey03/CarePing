"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { Download, LogOut, Trash2, RotateCcw, ShieldAlert } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteAccount } from "@/actions/deleteAccount";
import { exportUserData } from "@/actions/exportUserData";
import { resetHabitData } from "@/actions/resetHabitData";

export default function AccountSettings() {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      await exportUserData();
    });
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "This will reset all habits, streaks, and analytics. Continue?",
    );

    if (!confirmed) return;

    startTransition(async () => {
      await resetHabitData();
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "This action permanently deletes your account. Continue?",
    );

    if (!confirmed) return;

    startTransition(async () => {
      await deleteAccount();
    });
  };

  return (
    <Card className="border-red-300">
      <CardHeader>
        <CardTitle>Account</CardTitle>

        <CardDescription>
          Manage your account and personal data.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleExport}
          disabled={isPending}
        >
          <Download className="mr-2 h-4 w-4" />
          Export My Data
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleReset}
          disabled={isPending}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Habit Progress
        </Button>

        <Button
          variant="secondary"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>

        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />

          <AlertTitle>Danger Zone</AlertTitle>

          <AlertDescription>
            Deleting your account will permanently remove your habits, reports,
            analytics, AI insights, notifications, and all associated data.
          </AlertDescription>
        </Alert>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
