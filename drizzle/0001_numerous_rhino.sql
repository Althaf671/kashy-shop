ALTER TABLE "session" ADD COLUMN "device" varchar(500);--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_agent" varchar(250);--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "ip_address" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "biography" varchar(1000);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birthday_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "quote" varchar(250);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_banner" jsonb;