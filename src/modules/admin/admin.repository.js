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
import { and, count, eq, isNotNull, isNull, sum } from "drizzle-orm";
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
        and(
          eq(addressPool.network, "BTC"),
          eq(addressPool.status, "active"),
          isNull(addressPool.assignedUserId),
        ),
      );

    const [{ btcAssigned }] = await db
      .select({ btcAssigned: count() })
      .from(addressPool)
      .where(
        and(
          eq(addressPool.network, "BTC"),
          isNotNull(addressPool.assignedUserId),
        ),
      );

    const [{ trcTotal }] = await db
      .select({ trcTotal: count() })
      .from(addressPool)
      .where(eq(addressPool.network, "TRC20"));

    const [{ trcAvailable }] = await db
      .select({ trcAvailable: count() })
      .from(addressPool)
      .where(
        and(
          eq(addressPool.network, "TRC20"),
          eq(addressPool.status, "active"),
          isNull(addressPool.assignedUserId),
        ),
      );

    const [{ trcAssigned }] = await db
      .select({ trcAssigned: count() })
      .from(addressPool)
      .where(
        and(
          eq(addressPool.network, "TRC20"),
          isNotNull(addressPool.assignedUserId),
        ),
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
      btcAssigned,

      trcTotal,
      trcAvailable,
      trcAssigned,

      totalWallet: Number(totalWallet ?? 0),

      totalLocked: Number(totalLocked ?? 0),

      totalEscrows,

      totalOrders,

      totalWithdrawals,

      totalProducts,
    };
  }
}
