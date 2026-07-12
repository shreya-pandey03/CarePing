export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
} as const;

export const CHART_PALETTE = [
  "#3b82f6",
  "#22c55e",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#14b8a6",
  "#ec4899",
  "#84cc16",
  "#6366f1",
] as const;

export const HEATMAP_COLORS = {
  empty: "#ebedf0",
  level1: "#c6e48b",
  level2: "#7bc96f",
  level3: "#239a3b",
  level4: "#196127",
} as const;

export const STREAK_COLORS = {
  low: "#ef4444",
  medium: "#f59e0b",
  high: "#22c55e",
} as const;

export const CORRELATION_COLORS = {
  positive: "#22c55e",
  neutral: "#94a3b8",
  negative: "#ef4444",
} as const;

export const PROGRESS_COLORS = {
  completed: "#22c55e",
  remaining: "#e5e7eb",
} as const;
