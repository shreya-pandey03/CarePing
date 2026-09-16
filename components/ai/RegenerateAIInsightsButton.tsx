"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { regenerateAIInsights } from "@/lib/ai/regenerateAIInsights";
import { Button } from "@/components/ui/button";

export default function RegenerateAIInsightsButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleRegenerate = () => {
    setError("");

    startTransition(async () => {
      try {
        await regenerateAIInsights();
        router.refresh();
      } catch (error) {
        console.error(error);
        setError("Failed to regenerate AI insights.");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleRegenerate}
        disabled={isPending}
        variant="outline"
        className="gap-2"
      >
        {isPending ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}

        {isPending ? "Generating..." : "Regenerate AI Insights"}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
