"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import { markAllNotificationsAsRead } from "@/actions/notifications/markAllAsRead";

export default function MarkAllAsReadButton() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await markAllNotificationsAsRead();

      router.refresh();
    });
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={isPending}>
      <CheckCheck className="mr-2 h-4 w-4" />

      {isPending ? "Updating..." : "Mark all as read"}
    </Button>
  );
}
