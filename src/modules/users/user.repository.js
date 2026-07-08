import { eq } from "drizzle-orm";

import { db } from "../../database/db.js";
import { users } from "../../database/schema/index.js";

export class UserRepository {
  static async findByTelegramId(telegramId) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.telegramId, telegramId))
      .limit(1);

    return result[0] ?? null;
  }

  static async create(data) {
    const result = await db.insert(users).values(data).returning();

    return result[0];
  }
}
