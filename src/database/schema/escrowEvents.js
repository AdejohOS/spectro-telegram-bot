import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { escrows } from "./escrows.js";
import { users } from "./users.js";

export const escrowEvents = pgTable("escrow_events", {
  id: uuid("id").defaultRandom().primaryKey(),

  escrowId: uuid("escrow_id")
    .references(() => escrows.id, {
      onDelete: "cascade",
    })
    .notNull(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  event: text("event").notNull(),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
