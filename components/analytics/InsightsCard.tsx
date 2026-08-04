interface Props {
  insights: string[];
}

export default function InsightsCard({ insights }: Props) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">AI Insights</h2>
      <div className="space-y-3">
        {insights.map((item, index) => (
          <div key={index} className="rounded-lg border bg-muted/40 p-4">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
