import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { wallets } from "./wallets.js";
import { users } from "./users.js";
import { escrows } from "./escrows.js";

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),

  walletId: uuid("wallet_id")
    .references(() => wallets.id, {
      onDelete: "cascade",
    })
    .notNull(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  counterpartyId: uuid("counterparty_id").references(() => users.id),

  escrowId: uuid("escrow_id").references(() => escrows.id),

  type: text("type").notNull(),

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

  createdBy: uuid("created_by").references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
