"use client";

import { Sparkles, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

interface AIInsightCardProps {
  title: string;
  summary: string;
  confidence: number;
  createdAt: Date;
}

export default function AIInsightCard({
  title,
  summary,
  confidence,
  createdAt,
}: AIInsightCardProps) {
  return (
    <Card className="border-violet-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              {title}
            </CardTitle>

            <CardDescription>AI Generated Insight</CardDescription>
          </div>

          <Badge className="bg-violet-500 hover:bg-violet-600">AI</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="leading-7 text-muted-foreground">{summary}</p>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />

            <span className="font-medium">Confidence</span>
          </div>

          <Badge variant="secondary">{confidence}%</Badge>
        </div>

        <p suppressHydrationWarning>
          Generated on {createdAt.toLocaleDateString()} at{" "}
          {createdAt.toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
}
