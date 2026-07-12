import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const adminLogs = pgTable("admin_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  adminId: uuid("admin_id")
    .references(() => users.id)
    .notNull(),

  targetUserId: uuid("target_user_id").references(() => users.id),

  action: text("action").notNull(),

  reference: text("reference"),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
