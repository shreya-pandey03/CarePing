export function calculateGoalProgress(
  currentValue: number,
  targetValue: number,
) {
  if (targetValue <= 0) {
    return 0;
  }

  const progress = (currentValue / targetValue) * 100;

  return Math.min(Math.round(progress), 100);
}

export function getGoalStatus(
  currentValue: number,
  targetValue: number,
): "active" | "completed" {
  return currentValue >= targetValue ? "completed" : "active";
}
