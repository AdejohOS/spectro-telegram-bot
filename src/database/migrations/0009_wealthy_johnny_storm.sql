ALTER TABLE "escrows" ADD COLUMN "disputed_by" uuid;--> statement-breakpoint
ALTER TABLE "escrows" ADD COLUMN "dispute_reason" text;--> statement-breakpoint
ALTER TABLE "escrows" ADD CONSTRAINT "escrows_disputed_by_users_id_fk" FOREIGN KEY ("disputed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;