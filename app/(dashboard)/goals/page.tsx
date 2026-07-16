export default function GoalsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Goals</h1>

        <p className="text-muted-foreground">
          Track and manage your long-term goals.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <p>No goals created yet. Start by adding your first goal.</p>
      </div>
    </div>
  );
}
