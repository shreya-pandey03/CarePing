"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { regenerateAIRecommendations } from "@/lib/ai/regenerateAIRecommendations";

export default function RegenerateAIRecommendationsButton() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleRegenerate = () => {
    setError("");

    startTransition(async () => {
      try {
        await regenerateAIRecommendations();
        router.refresh();
      } catch (error) {
        console.error(error);
        setError("Failed to regenerate recommendations.");
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

        {isPending
          ? "Generating..."
          : "Regenerate Recommendations"}
      </Button>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}