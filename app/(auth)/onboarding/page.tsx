"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  const router = useRouter();

  const [goal, setGoal] = useState("");
  const [habit, setHabit] = useState("");

  async function finishOnboarding() {
    // TODO:
    // Save onboarding data using a Server Action or API route

    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Welcome 👋</CardTitle>

        <CardDescription>Let's personalize your AI coach.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Main Goal</label>

          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Become healthier"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">First Habit</label>

          <Input
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            placeholder="Exercise Daily"
          />
        </div>

        <Button className="w-full" onClick={finishOnboarding}>
          Finish Setup
        </Button>
      </CardContent>
    </Card>
  );
}
