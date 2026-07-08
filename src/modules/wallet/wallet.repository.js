import { eq } from "drizzle-orm";

import { db } from "../../database/db.js";
import { wallets } from "../../database/schema/index.js";

export class WalletRepository {
  static async findByUserId(userId) {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));

    return wallet ?? null;
  }

  static async create(userId) {
    const [wallet] = await db
      .insert(wallets)
      .values({
        userId,
      })
      .returning();

    return wallet;
  }
}
