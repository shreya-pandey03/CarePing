import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { badges, userBadges } from "@/drizzle/schema";
import { Card, CardContent } from "@/components/ui/card";
import BadgeCard from "@/components/achievements/BadgeCard";

export default async function AchievementsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const allBadges = await db.query.badges.findMany();
  const earnedBadges = await db.query.userBadges.findMany({
    where: eq(userBadges.userId, session.user.id),
  });

  const earnedIds = new Set(earnedBadges.map((badge) => badge.badgeId));

  const badgeData = allBadges.map((badge) => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    rarity: badge.rarity,
    earned: earnedIds.has(badge.id),
  }));

  const earnedCount = badgeData.filter((badge) => badge.earned).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>

        <p className="text-muted-foreground">
          Complete habits, build streaks, and unlock achievements.
        </p>
      </div>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Achievements unlocked
              </p>

              <p className="text-3xl font-bold">
                {earnedCount} / {badgeData.length}
              </p>
            </div>

            <div className="text-4xl">🏆</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {badgeData.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}
