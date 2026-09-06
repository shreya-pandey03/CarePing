import { ArrowRight, Lightbulb, Sparkles, Target } from "lucide-react";

import { getLatestAIRecommendations } from "@/lib/ai/getLatestAIRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function RecommendationsPage() {
  const data = await getLatestAIRecommendations();

  const recommendations = data?.recommendations ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Target className="h-7 w-7" />
          AI Recommendations
        </h1>

        <p className="mt-1 text-muted-foreground">
          Personalized actions based on your habit performance.
        </p>
      </div>

      {/* Empty State */}
      {!data || recommendations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-violet-500" />

            <h2 className="text-lg font-semibold">No recommendations yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Generate an AI insight report to receive personalized
              recommendations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Latest Focus */}
          <Card className="border-violet-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                Your Current Focus
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="leading-7 text-muted-foreground">
                {recommendations[0].description}
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />

              <h2 className="text-xl font-semibold">Recommended Actions</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((recommendation, index) => (
                <Card key={`${recommendation.title}-${index}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base">
                        {recommendation.title}
                      </CardTitle>

                      <Badge variant="secondary">
                        {index === 0 ? "Priority" : "Recommended"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {recommendation.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                      Take action
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Source */}
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Sparkles className="h-5 w-5 text-violet-500" />

              <div>
                <p className="text-sm font-medium">
                  Powered by your AI Habit Coach
                </p>

                <p
                  className="text-xs text-muted-foreground"
                  suppressHydrationWarning
                >
                  Generated {new Date(data.generatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
