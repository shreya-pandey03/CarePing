import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export function getWeekRange() {
  const now = new Date();

  return {
    start: startOfWeek(now, {
      weekStartsOn: 1,
    }),
    end: endOfWeek(now, {
      weekStartsOn: 1,
    }),
  };
}

export function getMonthRange() {
  const now = new Date();

  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}
