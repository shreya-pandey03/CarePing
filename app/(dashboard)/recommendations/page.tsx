import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RegenerateAIRecommendationsButton from "@/components/ai/RegenerateAIRecommendationsButton";
import { getAIRecommendations } from "@/lib/ai/getAIRecommendations";


export default async function RecommendationsPage() {
  const data = await getAIRecommendations();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Recommendations</h1>

          <p className="text-muted-foreground">
            Personalized actions to improve your habit consistency.
          </p>
        </div>

        <RegenerateAIRecommendationsButton />
      </div>

      {data.recommendations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Lightbulb className="mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-xl font-semibold">No recommendations yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Complete some habits and generate recommendations based on your
              activity.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.recommendations.map((recommendation, index) => {
            const Icon =
              recommendation.priority === "high"
                ? AlertTriangle
                : recommendation.priority === "medium"
                  ? CircleAlert
                  : CheckCircle2;

            return (
              <Card key={`${recommendation.title}-${index}`}>
                <CardContent className="flex gap-4 p-6">
                  <div className="mt-1">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{recommendation.title}</h2>

                      <Badge
                        variant={
                          recommendation.priority === "high"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          Recommendations are generated from your current habit analytics.
        </CardContent>
      </Card>
    </div>
  );
}

