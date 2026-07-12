import {
  BookOpen,
  Brain,
  Briefcase,
  Code2,
  DollarSign,
  Dumbbell,
  HeartPulse,
  Leaf,
  Salad,
  Shapes,
} from "lucide-react";

export const HABIT_CATEGORIES = [
  {
    value: "health",
    label: "Health",
    icon: HeartPulse,
    color: "#ef4444",
  },
  {
    value: "fitness",
    label: "Fitness",
    icon: Dumbbell,
    color: "#f97316",
  },
  {
    value: "reading",
    label: "Reading",
    icon: BookOpen,
    color: "#3b82f6",
  },
  {
    value: "learning",
    label: "Learning",
    icon: Brain,
    color: "#8b5cf6",
  },
  {
    value: "coding",
    label: "Coding",
    icon: Code2,
    color: "#06b6d4",
  },
  {
    value: "career",
    label: "Career",
    icon: Briefcase,
    color: "#6366f1",
  },
  {
    value: "finance",
    label: "Finance",
    icon: DollarSign,
    color: "#22c55e",
  },
  {
    value: "mindfulness",
    label: "Mindfulness",
    icon: Leaf,
    color: "#10b981",
  },
  {
    value: "nutrition",
    label: "Nutrition",
    icon: Salad,
    color: "#84cc16",
  },
  {
    value: "custom",
    label: "Custom",
    icon: Shapes,
    color: "#6b7280",
  },
] as const;

export const HABIT_CATEGORY_OPTIONS = HABIT_CATEGORIES.map((category) => ({
  label: category.label,
  value: category.value,
}));

export function getHabitCategory(value: string) {
  return (
    HABIT_CATEGORIES.find((category) => category.value === value) ??
    HABIT_CATEGORIES.at(-1)!
  );
}
