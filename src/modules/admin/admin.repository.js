import { db } from "../../database/db.js";
import {
  users,
  addressPool,
  wallets,
  escrows,
  withdrawals,
  orders,
  products,
} from "../../database/schema/index.js";
import { count, eq, isNull, sum } from "drizzle-orm";
export class AdminRepository {
  static async findPending(page = 1, limit = 10) {
    return db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, WITHDRAWAL_STATUS.PENDING))
      .limit(limit)
      .offset((page - 1) * limit);
  }
  static async getStatistics() {
    const [{ totalUsers }] = await db
      .select({ totalUsers: count() })
      .from(users);

    const [{ btcTotal }] = await db
      .select({ btcTotal: count() })
      .from(addressPool)
      .where(eq(addressPool.network, "BTC"));

    const [{ btcAvailable }] = await db
      .select({ btcAvailable: count() })
      .from(addressPool)
      .where(
        eq(addressPool.network, "BTC"),
        isNull(addressPool.assignedUserId),
      );

    const [{ trcTotal }] = await db
      .select({ trcTotal: count() })
      .from(addressPool)
      .where(eq(addressPool.network, "TRC20"));

    const [{ trcAvailable }] = await db
      .select({ trcAvailable: count() })
      .from(addressPool)
      .where(
        eq(addressPool.network, "TRC20"),
        isNull(addressPool.assignedUserId),
      );

    const [{ totalWallet }] = await db
      .select({
        totalWallet: sum(wallets.availableBalance),
      })
      .from(wallets);

    const [{ totalLocked }] = await db
      .select({
        totalLocked: sum(wallets.lockedBalance),
      })
      .from(wallets);

    const [{ totalEscrows }] = await db
      .select({ totalEscrows: count() })
      .from(escrows);

    const [{ totalOrders }] = await db
      .select({ totalOrders: count() })
      .from(orders);

    const [{ totalWithdrawals }] = await db
      .select({ totalWithdrawals: count() })
      .from(withdrawals);

    const [{ totalProducts }] = await db
      .select({ totalProducts: count() })
      .from(products);

    return {
      totalUsers,

      btcTotal,
      btcAvailable,
      btcAssigned: btcTotal - btcAvailable,

      trcTotal,
      trcAvailable,
      trcAssigned: trcTotal - trcAvailable,

      totalWallet: Number(totalWallet ?? 0),

      totalLocked: Number(totalLocked ?? 0),

      totalEscrows,

      totalOrders,

      totalWithdrawals,

      totalProducts,
    };
  }
}
