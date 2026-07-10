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
  real,
  json,
} from "drizzle-orm/pg-core";

export const habitFrequency = pgEnum("habit_frequency", [
  "daily",
  "weekly",
  "monthly",
]);

export const insightType = pgEnum("insight_type", [
  "weekly",
  "monthly",
  "streak",
  "goal",
  "recommendation",
  "motivation",
]);

export const recommendationType = pgEnum("recommendation_type", [
  "daily",
  "weekly",
  "goal",
  "habit",
  "correlation",
]);

export const notificationCategory = pgEnum("notification_category", [
  "habit_reminder",
  "goal_reminder",
  "weekly_report",
  "monthly_report",
  "streak_warning",
  "motivation",
  "achievement",
]);

export const badgeRarity = pgEnum("badge_rarity", [
  "common",
  "rare",
  "epic",
  "legendary",
]);

export const badges = pgTable("badges", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),

  description: text("description"),

  icon: text("icon"),

  rarity: badgeRarity("rarity").default("common").notNull(),

  requiredValue: integer("required_value").default(1).notNull(),

  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export const userBadges = pgTable(
  "user_badges",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    badgeId: text("badge_id")
      .references(() => badges.id, {
        onDelete: "cascade",
      })
      .notNull(),

    earnedAt: timestamp("earned_at", {
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    badgeUserUnique: uniqueIndex("user_badge_unique").on(
      table.userId,
      table.badgeId,
    ),
  }),
);

export const monthlyReports = pgTable("monthly_reports", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  month: integer("month").notNull(),

  year: integer("year").notNull(),

  completionRate: real("completion_rate").default(0).notNull(),

  totalHabits: integer("total_habits").default(0).notNull(),

  completedHabits: integer("completed_habits").default(0).notNull(),

  report: text("report").notNull(),

  aiSummary: text("ai_summary"),

  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export const aiInsights = pgTable("ai_insights", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: text("title").notNull(),

  summary: text("summary").notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  metadata: json("metadata"),
});

export const weeklyReports = pgTable("weekly_reports", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  weekStart: timestamp("week_start").notNull(),

  weekEnd: timestamp("week_end").notNull(),

  completionRate: real("completion_rate").default(0).notNull(),

  totalHabits: integer("total_habits").default(0).notNull(),

  completedHabits: integer("completed_habits").default(0).notNull(),

  report: text("report").notNull(),

  aiSummary: text("ai_summary"),

  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

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

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    title: text("title").notNull(),

    message: text("message").notNull(),

    category: notificationCategory("category").notNull(),

    isRead: boolean("is_read").default(false).notNull(),

    actionUrl: text("action_url"),

    scheduledFor: timestamp("scheduled_for", {
      mode: "date",
    }),

    sentAt: timestamp("sent_at", {
      mode: "date",
    }),

    createdAt: timestamp("created_at", {
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("notification_user_idx").on(table.userId),
  }),
);

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

    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

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
    userIndex: index("streaks_user_idx").on(table.userId),
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

export const recommendations = pgTable("recommendations", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  habitId: text("habit_id").references(() => habits.id, {
    onDelete: "cascade",
  }),

  type: recommendationType("type").notNull(),

  title: text("title").notNull(),

  description: text("description").notNull(),

  priority: integer("priority").default(1).notNull(),

  accepted: boolean("accepted").default(false).notNull(),

  dismissed: boolean("dismissed").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habitCorrelations = pgTable("habit_correlations", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  habitAId: text("habit_a_id")
    .references(() => habits.id, {
      onDelete: "cascade",
    })
    .notNull(),

  habitBId: text("habit_b_id")
    .references(() => habits.id, {
      onDelete: "cascade",
    })
    .notNull(),

  correlationScore: real("correlation_score").default(0).notNull(),

  insight: text("insight"),

  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});
