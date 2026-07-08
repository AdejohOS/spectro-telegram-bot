import { pgTable, uuid, bigint, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const wallets = pgTable("wallets", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .unique()
    .notNull(),

  availableBalance: bigint("available_balance", {
    mode: "number",
  })
    .default(0)
    .notNull(),

  lockedBalance: bigint("locked_balance", {
    mode: "number",
  })
    .default(0)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
