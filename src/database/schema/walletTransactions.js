import { pgTable, uuid, text, bigint, timestamp } from "drizzle-orm/pg-core";

import { wallets } from "./wallets.js";

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),

  walletId: uuid("wallet_id")
    .references(() => wallets.id, {
      onDelete: "cascade",
    })
    .notNull(),

  type: text("type").notNull(),

  direction: text("direction").notNull(),

  network: text("network"),

  amount: bigint("amount", {
    mode: "number",
  }).notNull(),

  balanceBefore: bigint("balance_before", {
    mode: "number",
  }).notNull(),

  balanceAfter: bigint("balance_after", {
    mode: "number",
  }).notNull(),

  reference: text("reference"),

  status: text("status").default("completed").notNull(),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
