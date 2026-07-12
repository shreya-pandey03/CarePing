"use client";

import { Sparkles, Quote, Flame, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

interface MotivationCardProps {
  title: string;
  message: string;
  streak: number;
  completedToday: number;
  goalToday: number;
  onRefresh?: () => void;
}

export default function MotivationCard({
  title,
  message,
  streak,
  completedToday,
  goalToday,
  onRefresh,
}: MotivationCardProps) {
  const progress =
    goalToday === 0 ? 0 : Math.round((completedToday / goalToday) * 100);

  return (
    <Card className="border-violet-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              {title}
            </CardTitle>

            <CardDescription>Your AI Coach</CardDescription>
          </div>

          <Badge className="bg-violet-500 hover:bg-violet-600">AI</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Motivation */}

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Quote className="h-5 w-5 text-orange-500" />

            <span className="font-medium">Today's Motivation</span>
          </div>

          <p className="leading-7 text-muted-foreground">{message}</p>
        </div>

        {/* Stats */}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />

              <span className="font-medium">Current Streak</span>
            </div>

            <p className="text-3xl font-bold">{streak}</p>

            <p className="text-sm text-muted-foreground">Days</p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />

              <span className="font-medium">Today's Progress</span>
            </div>

            <p className="text-3xl font-bold">
              {completedToday}/{goalToday}
            </p>

            <p className="text-sm text-muted-foreground">
              {progress}% Completed
            </p>
          </div>
        </div>

        {onRefresh && (
          <Button onClick={onRefresh} className="w-full">
            Generate New Motivation
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
