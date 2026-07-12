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

  static async findByUserIdTx(tx, userId) {
    const [wallet] = await tx
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));

    return wallet ?? null;
  }

  static async findById(walletId) {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.id, walletId));

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

  static async updateBalance(tx, walletId, availableBalance, lockedBalance) {
    const [wallet] = await tx
      .update(wallets)
      .set({
        availableBalance,
        lockedBalance,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, walletId))
      .returning();

    return wallet;
  }
}
