import {
  bigint,
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { ESCROW_STATUS } from "../../utils/references.js";

import { users } from "./users.js";

export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  amount: numeric("amount").notNull(),

  network: varchar("network", { length: 20 }).notNull(),

  address: text("address").notNull(),

  reference: varchar("reference", { length: 50 }).notNull().unique(),

  status: varchar("status", { length: 20 }).default("pending").notNull(),

  approvedBy: uuid("approved_by").references(() => users.id),

  approvedAt: timestamp("approved_at"),

  rejectedBy: uuid("rejected_by").references(() => users.id),

  rejectedAt: timestamp("rejected_at"),

  rejectionReason: text("rejection_reason"),

  completedAt: timestamp("completed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
