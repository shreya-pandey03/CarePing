import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  primaryKey,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const habitFrequency = pgEnum("habit_frequency", [
  "daily",
  "weekly",
  "monthly",
]);

export const habitCategory = pgEnum("habit_category", [
  "health",
  "fitness",
  "reading",
  "learning",
  "coding",
  "career",
  "finance",
  "mindfulness",
  "nutrition",
  "custom",
]);

export const recommendationPriority = pgEnum("recommendation_priority", [
  "low",
  "medium",
  "high",
]);

export const notificationType = pgEnum("notification_type", [
  "habit",
  "goal",
  "report",
  "motivation",
]);

export const goalStatus = pgEnum("goal_status", [
  "active",
  "completed",
  "paused",
]);

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
  }),
  image: text("image"),
});

export const habits = pgTable(
  "habits",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    title: text("title").notNull(),

    description: text("description"),

    category: habitCategory("category").default("custom").notNull(),

    frequency: habitFrequency("frequency").default("daily").notNull(),

    targetDays: integer("target_days").default(1).notNull(),

    color: text("color"),

    icon: text("icon"),

    reminderTime: text("reminder_time"),

    active: boolean("active").default(true).notNull(),

    archived: boolean("archived").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("habit_user_idx").on(table.userId),
  }),
);

export const habitLogs = pgTable(
  "habit_logs",
  {
    id: text("id").primaryKey(),

    habitId: text("habit_id")
      .references(() => habits.id, {
        onDelete: "cascade",
      })
      .notNull(),

    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    completed: boolean("completed").default(true).notNull(),

    value: integer("value"),

    notes: text("notes"),

    completedAt: timestamp("completed_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    habitIdx: index("log_habit_idx").on(table.habitId),

    userIdx: index("log_user_idx").on(table.userId),
  }),
);

export const streaks = pgTable(
  "streaks",
  {
    id: text("id").primaryKey(),

    habitId: text("habit_id")
      .references(() => habits.id, {
        onDelete: "cascade",
      })
      .unique()
      .notNull(),

    currentStreak: integer("current_streak").default(0).notNull(),

    longestStreak: integer("longest_streak").default(0).notNull(),

    totalCompletions: integer("total_completions").default(0).notNull(),

    lastCompletedAt: timestamp("last_completed_at"),

    riskScore: integer("risk_score").default(0).notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    habitUnique: uniqueIndex("habit_streak_unique").on(table.habitId),
  }),
);

export const accounts = pgTable(
  "account",
  {
    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  expires: timestamp("expires", {
    mode: "date",
  }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),

    token: text("token").notNull(),

    expires: timestamp("expires", {
      mode: "date",
    }).notNull(),
  },

  (table) => ({
    compositePk: primaryKey({
      columns: [table.identifier, table.token],
    }),
  }),
);

export const goals = pgTable(
  "goals",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    title: text("title").notNull(),

    description: text("description"),

    targetValue: integer("target_value").default(30).notNull(),

    currentValue: integer("current_value").default(0).notNull(),

    status: goalStatus("status").default("active").notNull(),

    deadline: timestamp("deadline"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("goal_user_idx").on(table.userId),
  }),
);
