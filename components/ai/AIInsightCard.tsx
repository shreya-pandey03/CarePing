"use client";

import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

interface AIInsightCardProps {
  title: string;
  description: string;
  type: "positive" | "warning" | "neutral";
}

export default function AIInsightCard({
  title,
  description,
  type,
}: AIInsightCardProps) {
  const icon =
    type === "warning" ? (
      <AlertTriangle className="h-5 w-5 text-yellow-500" />
    ) : type === "positive" ? (
      <TrendingUp className="h-5 w-5 text-green-500" />
    ) : (
      <Sparkles className="h-5 w-5 text-violet-500" />
    );

  const label =
    type === "positive"
      ? "Positive"
      : type === "warning"
        ? "Needs Attention"
        : "Insight";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>

            <CardDescription className="mt-1">
              AI-generated insight
            </CardDescription>
          </div>

          <Badge variant="secondary">{label}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="leading-7 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
