CREATE TYPE "public"."address_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."network" AS ENUM('BTC', 'TRC20');--> statement-breakpoint
CREATE TYPE "public"."wallet_transaction_direction" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "public"."wallet_transaction_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."wallet_transaction_type" AS ENUM('deposit', 'withdrawal', 'escrow_lock', 'escrow_release', 'refund', 'adjustment');--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"available_balance" bigint DEFAULT 0 NOT NULL,
	"locked_balance" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "address_pool" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network" text NOT NULL,
	"address" text NOT NULL,
	"assigned_user_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"assigned_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "address_pool_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"type" text NOT NULL,
	"direction" text NOT NULL,
	"network" text,
	"amount" bigint NOT NULL,
	"balance_before" bigint NOT NULL,
	"balance_after" bigint NOT NULL,
	"reference" text,
	"status" text DEFAULT 'completed' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."user_status";--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'banned');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."user_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "public"."user_status" USING "status"::"public"."user_status";--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address_pool" ADD CONSTRAINT "address_pool_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;