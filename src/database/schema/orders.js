import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { products } from "./products.js";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderNumber: varchar("order_number", { length: 50 }).unique().notNull(),

  buyerId: uuid("buyer_id")
    .references(() => users.id)
    .notNull(),

  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),

  productTitle: varchar("product_title", { length: 255 }).notNull(),

  amount: numeric("amount").notNull(),

  status: varchar("status", { length: 20 }).default("pending").notNull(),

  trackingNumber: varchar("tracking_number", {
    length: 100,
  }),

  lockedAt: timestamp("locked_at"),

  shippedAt: timestamp("shipped_at"),

  deliveredAt: timestamp("delivered_at"),

  completedAt: timestamp("completed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
