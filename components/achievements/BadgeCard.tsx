import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BadgeData = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
};

export default function BadgeCard({ badge }: { badge: BadgeData }) {
  return (
    <Card className={badge.earned ? "" : "opacity-50 grayscale"}>
      <CardHeader className="text-center">
        <div className="text-5xl">{badge.icon ?? "🏆"}</div>

        <CardTitle>{badge.name}</CardTitle>

        <Badge variant="secondary">{badge.rarity}</Badge>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">{badge.description}</p>

        <p className="mt-3 text-sm font-medium">
          {badge.earned ? "✓ Earned" : "Locked"}
        </p>
      </CardContent>
    </Card>
  );
}
