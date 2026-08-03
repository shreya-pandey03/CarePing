import { Habit, HabitLog, Streak } from "@/drizzle/schema";


export function calculateHabitPerformance(
  habit: Habit,
  logs: HabitLog[],
  streak?: Streak,
) {

  const habitLogs = logs.filter(
    (log) => log.habitId === habit.id
  );


  const totalCompleted = habitLogs.length;
  const today = new Date();

  const daysSinceCreated =
    Math.max(
      1,
      Math.ceil(
        (
          today.getTime() -
          habit.createdAt.getTime()
        ) /
        (1000 * 60 * 60 * 24)
      )
    );


  const completionRate =
    Math.round(
      (totalCompleted / daysSinceCreated) * 100
    );


  const lastCompleted =
    habitLogs.length > 0
      ? habitLogs[0].completedAt
      : null;


  return {

    habitId: habit.id,

    title: habit.title,

    totalCompleted,

    completionRate:
      Math.min(completionRate,100),

    currentStreak:
      streak?.currentStreak ?? 0,

    longestStreak:
      streak?.longestStreak ?? 0,

    lastCompleted,

  };

}