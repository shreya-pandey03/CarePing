CREATE TYPE "public"."badge_rarity" AS ENUM('common', 'rare', 'epic', 'legendary');--> statement-breakpoint
CREATE TYPE "public"."insight_type" AS ENUM('weekly', 'monthly', 'streak', 'goal', 'recommendation', 'motivation');--> statement-breakpoint
CREATE TYPE "public"."notification_category" AS ENUM('habit_reminder', 'goal_reminder', 'weekly_report', 'monthly_report', 'streak_warning', 'motivation', 'achievement');--> statement-breakpoint
CREATE TYPE "public"."recommendation_type" AS ENUM('daily', 'weekly', 'goal', 'habit', 'correlation');--> statement-breakpoint
CREATE TABLE "ai_insights" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"habit_id" text,
	"type" "insight_type" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"confidence" real DEFAULT 0 NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"rarity" "badge_rarity" DEFAULT 'common' NOT NULL,
	"required_value" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_value" integer DEFAULT 30 NOT NULL,
	"current_value" integer DEFAULT 0 NOT NULL,
	"status" "goal_status" DEFAULT 'active' NOT NULL,
	"deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habit_correlations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"habit_a_id" text NOT NULL,
	"habit_b_id" text NOT NULL,
	"correlation_score" real DEFAULT 0 NOT NULL,
	"insight" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monthly_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"completion_rate" real DEFAULT 0 NOT NULL,
	"total_habits" integer DEFAULT 0 NOT NULL,
	"completed_habits" integer DEFAULT 0 NOT NULL,
	"report" text NOT NULL,
	"ai_summary" text,
	"generated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"category" "notification_category" NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"action_url" text,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"habit_id" text,
	"type" "recommendation_type" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"dismissed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_id" text NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"week_start" timestamp NOT NULL,
	"week_end" timestamp NOT NULL,
	"completion_rate" real DEFAULT 0 NOT NULL,
	"total_habits" integer DEFAULT 0 NOT NULL,
	"completed_habits" integer DEFAULT 0 NOT NULL,
	"report" text NOT NULL,
	"ai_summary" text,
	"generated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habits" RENAME COLUMN "target" TO "target_days";--> statement-breakpoint
ALTER TABLE "habit_logs" DROP CONSTRAINT "habit_logs_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "habits" DROP CONSTRAINT "habits_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "category" SET DEFAULT 'custom'::text;--> statement-breakpoint
DROP TYPE "public"."habit_category";--> statement-breakpoint
CREATE TYPE "public"."habit_category" AS ENUM('health', 'fitness', 'reading', 'learning', 'coding', 'career', 'finance', 'mindfulness', 'nutrition', 'custom');--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "category" SET DEFAULT 'custom'::"public"."habit_category";--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "category" SET DATA TYPE "public"."habit_category" USING "category"::"public"."habit_category";--> statement-breakpoint
ALTER TABLE "habit_logs" ALTER COLUMN "completed_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "habit_logs" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "frequency" SET DEFAULT 'daily'::"public"."habit_frequency";--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "frequency" SET DATA TYPE "public"."habit_frequency" USING "frequency"::"public"."habit_frequency";--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "streaks" ALTER COLUMN "current_streak" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "streaks" ALTER COLUMN "longest_streak" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "streaks" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "habit_logs" ADD COLUMN "completed" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "habit_logs" ADD COLUMN "value" integer;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "reminder_time" text;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "streaks" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "streaks" ADD COLUMN "total_completions" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "streaks" ADD COLUMN "risk_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_correlations" ADD CONSTRAINT "habit_correlations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_correlations" ADD CONSTRAINT "habit_correlations_habit_a_id_habits_id_fk" FOREIGN KEY ("habit_a_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_correlations" ADD CONSTRAINT "habit_correlations_habit_b_id_habits_id_fk" FOREIGN KEY ("habit_b_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_reports" ADD CONSTRAINT "monthly_reports_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_reports" ADD CONSTRAINT "weekly_reports_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "goal_user_idx" ON "goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_badge_unique" ON "user_badges" USING btree ("user_id","badge_id");--> statement-breakpoint
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "log_habit_idx" ON "habit_logs" USING btree ("habit_id");--> statement-breakpoint
CREATE INDEX "log_user_idx" ON "habit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "habit_user_idx" ON "habits" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "habit_streak_unique" ON "streaks" USING btree ("habit_id");--> statement-breakpoint
CREATE INDEX "streaks_user_idx" ON "streaks" USING btree ("user_id");