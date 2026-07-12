import { eq, count, desc } from "drizzle-orm";
import { withdrawals, users } from "../../database/schema/index.js";
import { db } from "../../database/db.js";
import { alias } from "drizzle-orm/pg-core";
import { WITHDRAWAL_STATUS } from "./withdrawal.status.js";

const user = alias(users, "user");
export class WithdrawalRepository {
  static async create(tx, data) {
    const [withdrawal] = await tx.insert(withdrawals).values(data).returning();

    return withdrawal;
  }

  static async findById(id) {
    const [withdrawal] = await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.id, id));

    return withdrawal ?? null;
  }
  static async findByIdTx(tx, id) {
    const [withdrawal] = await tx
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.id, id));

    return withdrawal ?? null;
  }

  static async findPending() {
    return db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, "pending"));
  }

  static async update(tx, id, data) {
    const [withdrawal] = await tx
      .update(withdrawals)
      .set(data)
      .where(eq(withdrawals.id, id))
      .returning();

    return withdrawal;
  }

  //pagination
  static async findByStatusPag(status, page = 1, limit = 5) {
    return db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, status))
      .orderBy(desc(withdrawals.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  }

  static async countByStatus(status) {
    const result = await db
      .select({
        total: count(),
      })
      .from(withdrawals)
      .where(eq(withdrawals.status, status));

    return Number(result[0].total);
  }
  static async findDetails(id) {
    const [withdrawal] = await db
      .select({
        id: withdrawals.id,

        reference: withdrawals.reference,

        amount: withdrawals.amount,

        network: withdrawals.network,

        address: withdrawals.address,

        status: withdrawals.status,

        createdAt: withdrawals.createdAt,

        approvedAt: withdrawals.approvedAt,

        rejectedAt: withdrawals.rejectedAt,

        rejectionReason: withdrawals.rejectionReason,

        userId: withdrawals.userId,

        username: user.username,

        firstName: user.firstName,

        telegramId: user.telegramId,
      })
      .from(withdrawals)
      .leftJoin(user, eq(withdrawals.userId, user.id))
      .where(eq(withdrawals.id, id));

    return withdrawal ?? null;
  }
}
