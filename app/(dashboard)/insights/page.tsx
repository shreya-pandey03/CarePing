import { Sparkles, Lightbulb, Target } from "lucide-react";

import { generateAIInsights } from "@/lib/ai/generateAIInsights";
import AIInsightCard from "@/components/ai/AIInsightCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAIInsightsHistory } from "@/lib/ai/getAIInsightsHistory";
import AIInsightsHistory from "@/components/ai/AIInsightsHistory";

export default async function InsightsPage() {
  const data = await generateAIInsights();
const history = await getAIInsightsHistory();
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Sparkles className="h-7 w-7" />
          AI Insights
        </h1>

        <p className="mt-1 text-muted-foreground">
          Personalized insights from your habit activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="leading-7 text-muted-foreground">
            {data.summary || "No summary is available yet."}
          </p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />

          <h2 className="text-xl font-semibold">Insights</h2>
        </div>

        {data.insights.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No insights are available yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.insights.map((insight, index) => (
              <AIInsightCard
                key={`${insight.title}-${index}`}
                title={insight.title}
                description={insight.description}
                type={insight.type}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />

          <h2 className="text-xl font-semibold">Recommendations</h2>
        </div>

        {data.recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No recommendations are available yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.recommendations.map((recommendation, index) => (
              <Card key={`${recommendation.title}-${index}`}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {recommendation.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {recommendation.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <AIInsightsHistory history={history} />
      </section>
    </div>
  );
}
