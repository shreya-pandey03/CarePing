import {
  Flame,
  Target,
  CheckCircle,
  ListTodo,
  Trophy,
  Activity,
} from "lucide-react";

import StatsCard from "./StatsCard";

export default function DashboardOverview({ stats }: { stats: any }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <StatsCard
        title="Total Habits"
        value={stats.totalHabits}
        icon={<ListTodo />}
      />

      <StatsCard
        title="Completed Today"
        value={stats.completedToday}
        icon={<CheckCircle />}
      />

      <StatsCard
        title="Completion Rate"
        value={`${stats.completionRate}%`}
        icon={<Target />}
      />

      <StatsCard
        title="Current Streak"
        value={stats.currentStreak}
        icon={<Flame />}
      />

      <StatsCard
        title="Longest Streak"
        value={stats.longestStreak}
        icon={<Trophy />}
      />

      <StatsCard
        title="Active Habits"
        value={stats.activeHabits}
        icon={<Activity />}
      />
    </div>
  );
}
