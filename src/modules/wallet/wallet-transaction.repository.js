import { eq, desc, count } from "drizzle-orm";

import { db } from "../../database/db.js";
import { walletTransactions } from "../../database/schema/index.js";

export class WalletTransactionRepository {
  static async findByUserIdPaginated(userId, page = 1, limit = 10) {
    const transactions = await db
      .select({
        id: walletTransactions.id,
        type: walletTransactions.type,
        amount: walletTransactions.amount,
        balanceBefore: walletTransactions.balanceBefore,
        balanceAfter: walletTransactions.balanceAfter,
        reference: walletTransactions.reference,
        status: walletTransactions.status,
        notes: walletTransactions.notes,
        createdBy: walletTransactions.createdBy,
        createdAt: walletTransactions.createdAt,
      })
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const result = await db
      .select({
        total: count(),
      })
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId));

    return {
      transactions,
      total: Number(result[0]?.total ?? 0),
      page,
      limit,
    };
  }
}
