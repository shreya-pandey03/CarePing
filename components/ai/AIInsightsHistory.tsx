"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InsightItem {
  title: string;
  description: string;
  type?: "positive" | "warning" | "neutral";
}

interface RecommendationItem {
  title: string;
  description: string;
}

interface AIInsightHistoryItem {
  id: string;
  summary: string;
  insights: InsightItem[];
  recommendations: RecommendationItem[];
  generatedAt: Date;
}

interface AIInsightsHistoryProps {
  history: AIInsightHistoryItem[];
}

export default function AIInsightsHistory({
  history,
}: AIInsightsHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            AI Insights History
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-8 w-8 opacity-50" />

            <p className="font-medium">No previous AI insights yet.</p>

            <p className="mt-1 text-sm">
              Generate more insights to build your AI coaching history.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          AI Insights History
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {history.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-xl border bg-background"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(isExpanded ? null : item.id)
                }
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-violet-500" />

                    <p className="font-semibold">
                      AI Coach Report
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />

                    <span suppressHydrationWarning>
                      {new Date(item.generatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-6 border-t p-5">
                  {/* Summary */}
                  <div>
                    <h3 className="mb-2 font-semibold">
                      AI Summary
                    </h3>

                    <p className="leading-7 text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>

                  {/* Insights */}
                  {item.insights?.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Insights
                      </h3>

                      <div className="space-y-3">
                        {item.insights.map((insight, index) => (
                          <div
                            key={`${item.id}-insight-${index}`}
                            className="rounded-lg border p-4"
                          >
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <h4 className="font-medium">
                                {insight.title}
                              </h4>

                              {insight.type && (
                                <Badge variant="secondary">
                                  {insight.type}
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm leading-6 text-muted-foreground">
                              {insight.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {item.recommendations?.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-semibold">
                        Recommendations
                      </h3>

                      <div className="space-y-3">
                        {item.recommendations.map(
                          (recommendation, index) => (
                            <div
                              key={`${item.id}-recommendation-${index}`}
                              className="rounded-lg border p-4"
                            >
                              <h4 className="font-medium">
                                {recommendation.title}
                              </h4>

                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {recommendation.description}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}