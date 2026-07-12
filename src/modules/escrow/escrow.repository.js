import { db } from "../../database/db.js";
import { escrows, users } from "../../database/schema/index.js";
import { and, desc, eq, or, count, inArray } from "drizzle-orm";
import { ESCROW_STATUS } from "../../utils/references.js";

import { alias } from "drizzle-orm/pg-core";

const buyer = alias(users, "buyer");
const seller = alias(users, "seller");

export class EscrowRepository {
  static async create(data) {
    const [escrow] = await db.insert(escrows).values(data).returning();

    return escrow;
  }

  static async findById(id) {
    const [escrow] = await db.select().from(escrows).where(eq(escrows.id, id));

    return escrow ?? null;
  }

  static async findByIdTx(tx, escrowId) {
    const [escrow] = await tx
      .select()
      .from(escrows)
      .where(eq(escrows.id, escrowId));

    return escrow ?? null;
  }

  static async updateStatus(tx, escrowId, status) {
    const [escrow] = await tx
      .update(escrows)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(escrows.id, escrowId))
      .returning();

    return escrow;
  }

  // not needed for pagination, just to get all pending escrows for a user
  static async findPending(userId) {
    return db
      .select({
        id: escrows.id,
        escrowNumber: escrows.escrowNumber,
        title: escrows.title,
        description: escrows.description,
        amount: escrows.amount,
        status: escrows.status,
        buyerId: escrows.buyerId,
        sellerId: escrows.sellerId,

        buyerUsername: buyer.username,
        buyerFirstName: buyer.firstName,

        sellerUsername: seller.username,
        sellerFirstName: seller.firstName,
      })
      .from(escrows)
      .leftJoin(buyer, eq(escrows.buyerId, buyer.id))
      .leftJoin(seller, eq(escrows.sellerId, seller.id))
      .where(
        and(
          eq(escrows.status, ESCROW_STATUS.PENDING_SELLER),
          or(eq(escrows.buyerId, userId), eq(escrows.sellerId, userId)),
        ),
      )
      .orderBy(desc(escrows.createdAt));
  }

  static async findDetails(id) {
    const [escrow] = await db
      .select({
        id: escrows.id,

        escrowNumber: escrows.escrowNumber,

        buyerId: escrows.buyerId,
        sellerId: escrows.sellerId,

        amount: escrows.amount,

        title: escrows.title,

        description: escrows.description,

        status: escrows.status,

        disputedBy: escrows.disputedBy,
        resolvedBy: escrows.resolvedBy,

        resolvedAt: escrows.resolvedAt,

        disputeReason: escrows.disputeReason,

        disputedAt: escrows.disputedAt,

        createdAt: escrows.createdAt,

        buyerUsername: buyer.username,
        buyerFirstName: buyer.firstName,
        buyerTelegramId: buyer.telegramId,

        sellerUsername: seller.username,
        sellerFirstName: seller.firstName,
        sellerTelegramId: seller.telegramId,
      })
      .from(escrows)
      .leftJoin(buyer, eq(escrows.buyerId, buyer.id))
      .leftJoin(seller, eq(escrows.sellerId, seller.id))
      .where(eq(escrows.id, id));

    return escrow ?? null;
  }

  static async update(tx, escrowId, data) {
    const [escrow] = await tx
      .update(escrows)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(escrows.id, escrowId))
      .returning();

    return escrow;
  }

  static async findByStatus(userId, status) {
    return db
      .select()
      .from(escrows)
      .where(
        and(
          eq(escrows.status, status),
          or(eq(escrows.buyerId, userId), eq(escrows.sellerId, userId)),
        ),
      )
      .orderBy(desc(escrows.createdAt));
  }
  static async findByActive(userId) {
    return db
      .select()
      .from(escrows)
      .where(
        and(
          or(
            eq(escrows.status, ESCROW_STATUS.FUNDED),
            eq(escrows.status, ESCROW_STATUS.DELIVERED),
          ),
          or(eq(escrows.buyerId, userId), eq(escrows.sellerId, userId)),
        ),
      )
      .orderBy(desc(escrows.createdAt));
  }

  // needed for pagination
  static async findByStatusPag(userId, status, page = 1, limit = 5) {
    return db
      .select()
      .from(escrows)
      .where(
        and(
          eq(escrows.status, status),
          or(eq(escrows.buyerId, userId), eq(escrows.sellerId, userId)),
        ),
      )
      .orderBy(desc(escrows.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  }
  static async countByStatus(userId, status) {
    const result = await db
      .select({
        total: count(),
      })
      .from(escrows)
      .where(
        and(
          eq(escrows.status, status),
          or(eq(escrows.buyerId, userId), eq(escrows.sellerId, userId)),
        ),
      );

    return Number(result[0].total);
  }
  static async findByActivePag(userId, page = 1, limit = 5) {
    return db
      .select()
      .from(escrows)
      .where(
        and(
          inArray(escrows.status, [
            ESCROW_STATUS.FUNDED,
            ESCROW_STATUS.DELIVERED,
          ]),
          or(eq(escrows.buyerId, userId), eq(escrows.sellerId, userId)),
        ),
      )
      .orderBy(desc(escrows.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  }
  static async countActive(userId) {
    const result = await db
      .select({
        total: count(),
      })
      .from(escrows)
      .where(
        and(
          inArray(escrows.status, [
            ESCROW_STATUS.FUNDED,
            ESCROW_STATUS.DELIVERED,
          ]),
          or(eq(escrows.buyerId, userId), eq(escrows.sellerId, userId)),
        ),
      );

    return Number(result[0].total);
  }

  //normal check continue
  static async getSummary(userId) {
    const rows = await db
      .select({
        status: escrows.status,
        total: count(),
      })
      .from(escrows)
      .where(or(eq(escrows.buyerId, userId), eq(escrows.sellerId, userId)))
      .groupBy(escrows.status);

    return rows;
  }

  static async findPendingDisputes(page = 1, limit = 5) {
    return db

      .select()

      .from(escrows)

      .where(
        eq(
          escrows.status,

          ESCROW_STATUS.DISPUTED,
        ),
      )

      .orderBy(desc(escrows.disputedAt))

      .limit(limit)

      .offset((page - 1) * limit);
  }
  static async countPendingDisputes() {
    const result = await db

      .select({
        total: count(),
      })

      .from(escrows)

      .where(
        eq(
          escrows.status,

          ESCROW_STATUS.DISPUTED,
        ),
      );

    return Number(result[0].total);
  }
}
