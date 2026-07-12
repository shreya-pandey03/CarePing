import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { notifications } from "@/drizzle/schema";

// Database Types

export type Notification = InferSelectModel<typeof notifications>;

export type NewNotification = InferInsertModel<typeof notifications>;

// Summary

export interface NotificationSummary {
  unread: number;

  total: number;
}

// Card

export interface NotificationCardData {
  notification: Notification;

  onRead?: (id: string) => void;

  onDelete?: (id: string) => void;
}

// Filters

export interface NotificationFilters {
  category?: Notification["category"];

  isRead?: boolean;
}

// API Response

export interface NotificationResponse {
  success: boolean;

  notifications: Notification[];

  message?: string;
}
