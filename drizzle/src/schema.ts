import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  image: text("image"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .references(() => users.id)
    .notNull(),

  title: text("title").notNull(),

  description: text("description"),

  category: text("category").notNull(),

  frequency: text("frequency").notNull(),

  target: integer("target").default(1),

  active: boolean("active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
});

export const habitLogs = pgTable("habit_logs", {
  id: text("id").primaryKey(),

  habitId: text("habit_id")
    .references(() => habits.id, {
      onDelete: "cascade",
    })
    .notNull(),

  userId: text("user_id")
    .references(() => users.id)
    .notNull(),

  completedAt: timestamp("completed_at").defaultNow(),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const streaks = pgTable("streaks", {
  id: text("id").primaryKey(),

  habitId: text("habit_id")
    .references(() => habits.id, {
      onDelete: "cascade",
    })
    .unique()
    .notNull(),

  currentStreak: integer("current_streak").default(0),

  longestStreak: integer("longest_streak").default(0),

  lastCompletedAt: timestamp("last_completed_at"),

  updatedAt: timestamp("updated_at").defaultNow(),
});
