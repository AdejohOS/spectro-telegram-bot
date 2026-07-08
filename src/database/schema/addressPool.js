import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const addressPool = pgTable("address_pool", {
  id: uuid("id").defaultRandom().primaryKey(),

  network: text("network").notNull(),

  address: text("address").unique().notNull(),

  assignedUserId: uuid("assigned_user_id").references(() => users.id, {
    onDelete: "set null",
  }),

  status: text("status").default("active").notNull(),

  assignedAt: timestamp("assigned_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
