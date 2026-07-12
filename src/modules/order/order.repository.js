import { db } from "../../database/db.js";
import { orders, users } from "../../database/schema/index.js";
import { eq, desc, count } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const buyer = alias(users, "buyer");

export class OrderRepository {
  static async create(tx, data) {
    const [order] = await tx.insert(orders).values(data).returning();

    return order;
  }

  static async findById(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));

    return order ?? null;
  }

  static async update(tx, id, data) {
    const [order] = await tx
      .update(orders)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return order;
  }
  static async findByStatusPag(status, page = 1, limit = 5) {
    return db
      .select()
      .from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  }

  static async countByStatus(status) {
    const result = await db
      .select({
        total: count(),
      })
      .from(orders)
      .where(eq(orders.status, status));

    return Number(result[0].total);
  }

  static async findDetails(id) {
    const buyer = alias(users, "buyer");

    const [order] = await db
      .select({
        id: orders.id,

        orderNumber: orders.orderNumber,

        amount: orders.amount,

        status: orders.status,

        productTitle: orders.productTitle,

        trackingNumber: orders.trackingNumber,

        buyerId: orders.buyerId,

        buyerUsername: buyer.username,

        buyerFirstName: buyer.firstName,

        buyerTelegramId: buyer.telegramId,

        createdAt: orders.createdAt,

        shippedAt: orders.shippedAt,

        deliveredAt: orders.deliveredAt,

        completedAt: orders.completedAt,
      })
      .from(orders)
      .leftJoin(buyer, eq(orders.buyerId, buyer.id))
      .where(eq(orders.id, id));

    return order ?? null;
  }
}
