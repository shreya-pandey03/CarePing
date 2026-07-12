import {
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";

export interface HeatmapEntry {
  completedAt: Date;
}

export interface HeatmapData {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export function generateHeatmapData(
  entries: HeatmapEntry[],
  days = 365,
): HeatmapData[] {
  const start = startOfDay(subDays(new Date(), days - 1));
  const end = endOfDay(new Date());

  const dates = eachDayOfInterval({
    start,
    end,
  });

  return dates.map((date) => {
    const count = entries.filter((entry) => {
      return (
        format(entry.completedAt, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
    }).length;

    let intensity: 0 | 1 | 2 | 3 | 4 = 0;

    if (count >= 4) {
      intensity = 4;
    } else if (count === 3) {
      intensity = 3;
    } else if (count === 2) {
      intensity = 2;
    } else if (count === 1) {
      intensity = 1;
    }

    return {
      date: format(date, "yyyy-MM-dd"),
      count,
      intensity,
    };
  });
}
