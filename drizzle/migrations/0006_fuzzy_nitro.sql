ALTER TABLE "notifications" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."notification_category";--> statement-breakpoint
CREATE TYPE "public"."notification_category" AS ENUM('achievement', 'motivation', 'habit_reminder', 'goal_reminder', 'weekly_report', 'monthly_report', 'streak_warning', 'recommendation', 'reminder');--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "category" SET DATA TYPE "public"."notification_category" USING "category"::"public"."notification_category";