import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export function formatDate(date: Date, pattern = "dd MMM yyyy") {
  return format(date, pattern);
}

export function getStartOfWeek(date = new Date()) {
  return startOfWeek(date, {
    weekStartsOn: 1,
  });
}

export function getEndOfWeek(date = new Date()) {
  return endOfWeek(date, {
    weekStartsOn: 1,
  });
}

export function getStartOfMonth(date = new Date()) {
  return startOfMonth(date);
}

export function getEndOfMonth(date = new Date()) {
  return endOfMonth(date);
}

export function daysBetween(start: Date, end: Date) {
  return differenceInCalendarDays(end, start);
}

export function addDaysToDate(date: Date, days: number) {
  return addDays(date, days);
}

export function isTodayDate(date: Date) {
  return isToday(date);
}

export function isSameCalendarDay(date1: Date, date2: Date) {
  return isSameDay(date1, date2);
}

export function parseDate(date: string) {
  return parseISO(date);
}

export function getMonthName(date: Date) {
  return format(date, "MMMM");
}

export function getWeekday(date: Date) {
  return format(date, "EEEE");
}

export function getShortWeekday(date: Date) {
  return format(date, "EEE");
}

export function getTime(date: Date) {
  return format(date, "hh:mm a");
}

export function getISODate(date: Date) {
  return format(date, "yyyy-MM-dd");
}
