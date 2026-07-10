ALTER TABLE "ai_insights" DROP CONSTRAINT "ai_insights_habit_id_habits_id_fk";
--> statement-breakpoint
ALTER TABLE "ai_insights" ALTER COLUMN "summary" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_insights" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_insights" DROP COLUMN "habit_id";--> statement-breakpoint
ALTER TABLE "ai_insights" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "ai_insights" DROP COLUMN "confidence";