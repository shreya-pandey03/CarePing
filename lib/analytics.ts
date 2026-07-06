export function calculateCompletionRate(completed: number, expected: number) {
  return (completed / expected) * 100;
}

export function calculateConsistency(values: number[]) {
  const total = values.reduce((a, b) => a + b, 0);

  return total / values.length;
}
