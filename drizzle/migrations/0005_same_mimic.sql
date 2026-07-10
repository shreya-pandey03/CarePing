ALTER TABLE "weekly_reports" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "weekly_reports" ADD COLUMN "summary" text NOT NULL;--> statement-breakpoint
ALTER TABLE "weekly_reports" ADD COLUMN "strengths" json NOT NULL;--> statement-breakpoint
ALTER TABLE "weekly_reports" ADD COLUMN "improvements" json NOT NULL;--> statement-breakpoint
ALTER TABLE "weekly_reports" ADD COLUMN "recommendations" json NOT NULL;--> statement-breakpoint
ALTER TABLE "weekly_reports" DROP COLUMN "report";--> statement-breakpoint
ALTER TABLE "weekly_reports" DROP COLUMN "ai_summary";