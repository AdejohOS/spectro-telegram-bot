ALTER TABLE "escrows" ADD COLUMN "resolved_by" uuid;--> statement-breakpoint
ALTER TABLE "escrows" ADD COLUMN "resolved_at" timestamp;--> statement-breakpoint
ALTER TABLE "escrows" ADD CONSTRAINT "escrows_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;