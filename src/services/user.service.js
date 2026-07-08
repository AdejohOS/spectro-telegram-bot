import { db } from "../database/db.js";
import { users } from "../database/schema/users.js";
import { eq } from "drizzle-orm";

export async function getUserByTelegramId(telegramId) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.telegramId, telegramId))
    .limit(1);

  return result[0] ?? null;
}
