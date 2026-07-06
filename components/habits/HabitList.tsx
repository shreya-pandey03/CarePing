type Habit = {
  id: string;
  title: string;
  category: string;
};

export default function HabitList({ habits }: { habits: Habit[] }) {
  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <div key={habit.id} className="rounded-lg border p-4">
          <h3>{habit.title}</h3>
          <p>{habit.category}</p>
        </div>
      ))}
    </div>
  );
}
