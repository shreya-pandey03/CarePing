import { Calendar, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIInsightsHistoryProps {
  history: Array<{
    id: string;
    summary: string;
    generatedAt: Date;
  }>;
}

export default function AIInsightsHistory({ history }: AIInsightsHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Insights History
        </CardTitle>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No previous AI insights yet.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />

                  {new Date(item.generatedAt).toLocaleString()}
                </div>

                <p className="text-sm leading-6">{item.summary}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
