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

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),

  description: text("description").notNull(),

  price: numeric("price").notNull(),

  stock: integer("stock").default(0).notNull(),

  imageFileId: text("image_file_id"),

  status: varchar("status", { length: 20 }).default("active").notNull(),

  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
