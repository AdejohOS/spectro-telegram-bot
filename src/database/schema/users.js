import {
  pgTable,
  uuid,
  bigint,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const userStatusEnum = pgEnum("user_status", ["active", "blocked"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  telegramId: bigint("telegram_id", { mode: "number" }).notNull().unique(),

  username: text("username"),

  firstName: text("first_name"),

  lastName: text("last_name"),

  languageCode: text("language_code"),

  role: userRoleEnum("role").default("user").notNull(),

  status: userStatusEnum("status").default("active").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
