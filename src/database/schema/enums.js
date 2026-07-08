import { pgEnum } from "drizzle-orm/pg-core";

export const networkEnum = pgEnum("network", ["BTC", "TRC20"]);

export const walletTransactionTypeEnum = pgEnum("wallet_transaction_type", [
  "deposit",
  "withdrawal",
  "escrow_lock",
  "escrow_release",
  "refund",
  "adjustment",
]);

export const walletTransactionDirectionEnum = pgEnum(
  "wallet_transaction_direction",
  ["credit", "debit"],
);

export const walletTransactionStatusEnum = pgEnum("wallet_transaction_status", [
  "pending",
  "completed",
  "failed",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "suspended",
  "banned",
]);

export const addressStatusEnum = pgEnum("address_status", [
  "active",
  "disabled",
]);
