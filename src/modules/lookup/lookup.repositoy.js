import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { users, wallets } from "../../database/schema/index.js";

export class AdminLookupRepository {
  static async getUserProfile(userId) {
    const [profile] = await db
      .select({
        id: users.id,
        telegramId: users.telegramId,
        firstName: users.firstName,
        username: users.username,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,

        availableBalance: wallets.availableBalance,
        lockedBalance: wallets.lockedBalance,
      })
      .from(users)
      .leftJoin(wallets, eq(users.id, wallets.userId))
      .where(eq(users.id, userId));

    return profile ?? null;
  }
}
