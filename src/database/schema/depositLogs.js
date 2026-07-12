import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { addressPool } from "./addressPool.js";

export const depositLogs = pgTable("deposit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "restrict",
    })
    .notNull(),

  addressId: uuid("address_id")
    .references(() => addressPool.id)
    .notNull(),

  amount: bigint("amount", {
    mode: "number",
  }).notNull(),

  txHash: text("tx_hash"),

  status: text("status").default("credited").notNull(),

  creditedBy: uuid("credited_by"),

  creditedAt: timestamp("credited_at"),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
