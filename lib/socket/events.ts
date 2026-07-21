export const SOCKET_EVENTS = {
  CONNECTION: "connection",

  // User
  JOIN_USER: "join-user",
  LEAVE_USER: "leave-user",

  // Habit
  HABIT_CREATED: "habit-created",
  HABIT_UPDATED: "habit-updated",
  HABIT_DELETED: "habit-deleted",
  HABIT_COMPLETED: "habit-completed",


  // Dashboard
  DASHBOARD_UPDATE: "dashboard-update",

  // Analytics
  ANALYTICS_UPDATE: "analytics-update",

  // AI
  AI_INSIGHT_READY: "ai-insight-ready",

  // Notifications
  NOTIFICATION_RECEIVED: "notification-received",
} as const;
