import { differenceInDays } from "date-fns";

export function calculateStreak(completionDates: Date[]) {
  if (!completionDates.length) {
    return 0;
  }

  const sorted = completionDates.sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInDays(sorted[i - 1], sorted[i]);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
