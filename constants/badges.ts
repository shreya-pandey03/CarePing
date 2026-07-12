export const BADGES = [
  {
    id: "first-habit",
    name: "First Habit",
    description: "Create your first habit.",
    icon: "🎯",
    rarity: "common",
    requiredValue: 1,
  },
  {
    id: "first-completion",
    name: "Getting Started",
    description: "Complete your first habit.",
    icon: "✅",
    rarity: "common",
    requiredValue: 1,
  },
  {
    id: "streak-7",
    name: "7 Day Streak",
    description: "Maintain a 7-day streak.",
    icon: "🔥",
    rarity: "common",
    requiredValue: 7,
  },
  {
    id: "streak-30",
    name: "30 Day Streak",
    description: "Maintain a 30-day streak.",
    icon: "🏆",
    rarity: "rare",
    requiredValue: 30,
  },
  {
    id: "streak-100",
    name: "100 Day Streak",
    description: "Maintain a 100-day streak.",
    icon: "💎",
    rarity: "epic",
    requiredValue: 100,
  },
  {
    id: "habit-master",
    name: "Habit Master",
    description: "Complete 500 habits.",
    icon: "👑",
    rarity: "legendary",
    requiredValue: 500,
  },
  {
    id: "consistent",
    name: "Consistency Master",
    description: "Reach 90% completion rate.",
    icon: "📈",
    rarity: "epic",
    requiredValue: 90,
  },
  {
    id: "goal-achiever",
    name: "Goal Achiever",
    description: "Complete your first goal.",
    icon: "🎉",
    rarity: "rare",
    requiredValue: 1,
  },
] as const;

export function getBadge(id: string) {
  return BADGES.find((badge) => badge.id === id);
}

export function getBadgesByRarity(
  rarity: "common" | "rare" | "epic" | "legendary",
) {
  return BADGES.filter((badge) => badge.rarity === rarity);
}
