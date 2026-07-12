import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { escrows } from "./escrows.js";
import { users } from "./users.js";

export const escrowMessages = pgTable("escrow_messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  escrowId: uuid("escrow_id")
    .references(() => escrows.id, {
      onDelete: "cascade",
    })
    .notNull(),

  senderId: uuid("sender_id")
    .references(() => users.id)
    .notNull(),

  message: text("message").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
