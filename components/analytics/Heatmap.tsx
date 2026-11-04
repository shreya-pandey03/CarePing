"use client";

interface Props {
  values: {
    date: string;
    count: number;
  }[];
}

export default function Heatmap({ values }: Props) {
  const intensity = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Yearly Habit Activity</h2>
      <div className="grid grid-cols-10 gap-2">
        {values.map((item) => (
          <div
            key={item.date}
            title={`${item.date} - ${item.count} completed`}
            className={`h-5 w-5 rounded-sm ${intensity(item.count)}`}
          />
        ))}
      </div>
      <div className="flex gap-3 text-sm">
        <span>Less</span>
        <span>🟩 More</span>
      </div>
    </div>
  );
}