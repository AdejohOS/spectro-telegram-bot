CREATE TABLE "deposit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"tx_hash" text,
	"status" text DEFAULT 'credited' NOT NULL,
	"credited_by" uuid,
	"credited_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deposit_logs" ADD CONSTRAINT "deposit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposit_logs" ADD CONSTRAINT "deposit_logs_address_id_address_pool_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address_pool"("id") ON DELETE no action ON UPDATE no action;