import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { goals } from "@/drizzle/schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CreateGoalForm from "@/components/goals/CreateGoalForm";

export default async function GoalsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userGoals = await db.query.goals.findMany({
    where: eq(goals.userId, session.user.id),
    orderBy: [desc(goals.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Goals</h1>

        <p className="text-muted-foreground">
          Set goals and track your progress over time.
        </p>
      </div>

      {/* Create Goal */}
      <Card>
        <CardHeader>
          <CardTitle>Create Goal</CardTitle>
        </CardHeader>

        <CardContent>
          <CreateGoalForm />
        </CardContent>
      </Card>

      {/* Goals */}
      {userGoals.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <h2 className="text-xl font-semibold">No goals yet</h2>

            <p className="mt-2 text-muted-foreground">
              Create your first goal to start tracking your progress.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {userGoals.map((goal) => {
            const progress =
              goal.targetValue === 0
                ? 0
                : Math.min(
                    Math.round((goal.currentValue / goal.targetValue) * 100),
                    100,
                  );

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle>{goal.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Progress</span>

                    <span>
                      {goal.currentValue} / {goal.targetValue}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {progress}% completed
                  </p>

                  {goal.deadline && (
                    <p className="text-sm text-muted-foreground">
                      Deadline: {goal.deadline.toLocaleDateString()}
                    </p>
                  )}

                  <p className="text-xs capitalize text-muted-foreground">
                    Status: {goal.status}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
