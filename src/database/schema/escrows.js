import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { ESCROW_STATUS } from "../../utils/references.js";

import { users } from "./users.js";

export const escrows = pgTable("escrows", {
  id: uuid("id").defaultRandom().primaryKey(),

  escrowNumber: text("escrow_number").unique().notNull(),

  buyerId: uuid("buyer_id")
    .references(() => users.id, {
      onDelete: "restrict",
    })
    .notNull(),

  sellerId: uuid("seller_id")
    .references(() => users.id, {
      onDelete: "restrict",
    })
    .notNull(),

  amount: bigint("amount", {
    mode: "number",
  }).notNull(),

  currency: text("currency").default("USD").notNull(),

  title: text("title").notNull(),

  description: text("description"),

  status: text("status").default(ESCROW_STATUS.PENDING_SELLER).notNull(),
  winnerId: uuid("winner_id").references(() => users.id),

  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),

  releasedBy: uuid("released_by").references(() => users.id),

  cancelledBy: uuid("cancelled_by").references(() => users.id),

  disputedAt: timestamp("disputed_at"),

  releasedAt: timestamp("released_at"),

  cancelledAt: timestamp("cancelled_at"),

  disputedBy: uuid("disputed_by").references(() => users.id),

  disputeReason: text("dispute_reason"),
  resolvedBy: uuid("resolved_by").references(() => users.id),

  resolvedAt: timestamp("resolved_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
