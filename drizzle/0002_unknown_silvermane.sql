ALTER TABLE "session" RENAME COLUMN "user_agent" TO "os";--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "browser" varchar(50);