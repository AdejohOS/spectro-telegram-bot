import { isNull, inArray, eq, and, count, isNotNull } from "drizzle-orm";

import { db } from "../../database/db.js";
import { addressPool } from "../../database/schema/index.js";

export class AddressRepository {
  /**
   * Find an address already assigned to a user
   */
  static async findUserAddress(userId, network) {
    const [address] = await db
      .select()
      .from(addressPool)
      .where(
        and(
          eq(addressPool.assignedUserId, userId),
          eq(addressPool.network, network),
          eq(addressPool.status, "active"),
        ),
      );

    return address ?? null;
  }

  /**
   * Find the first available address
   */
  static async findAvailableAddress(network) {
    const [address] = await db
      .select()
      .from(addressPool)
      .where(
        and(
          eq(addressPool.network, network),
          eq(addressPool.status, "active"),
          isNull(addressPool.assignedUserId),
        ),
      )
      .limit(1);

    return address ?? null;
  }

  /**
   * Assign an address to a user
   */
  static async assignAddress(addressId, userId) {
    const [address] = await db
      .update(addressPool)
      .set({
        assignedUserId: userId,
        assignedAt: new Date(),
      })
      .where(eq(addressPool.id, addressId))
      .returning();

    return address;
  }
  static async findByWalletAddress(address) {
    const [record] = await db
      .select()
      .from(addressPool)
      .where(eq(addressPool.address, address))
      .limit(1);

    return record ?? null;
  }

  static async createMany(values) {
    return db
      .insert(addressPool)
      .values(values)
      .onConflictDoNothing({
        target: addressPool.address,
      })
      .returning();
  }

  static async findManyByAddress(addresses) {
    return db
      .select()
      .from(addressPool)
      .where(inArray(addressPool.address, addresses));
  }

  static async findByNetworkPag(network, page = 1, limit = 10) {
    return db
      .select()
      .from(addressPool)
      .where(eq(addressPool.network, network))
      .limit(limit)
      .offset((page - 1) * limit);
  }

  static async countByNetwork(network) {
    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(addressPool)
      .where(eq(addressPool.network, network));

    return Number(total);
  }

  static async statistics(network) {
    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(addressPool)
      .where(eq(addressPool.network, network));

    const [{ assigned }] = await db
      .select({
        assigned: count(),
      })
      .from(addressPool)
      .where(
        and(
          eq(addressPool.network, network),
          isNotNull(addressPool.assignedUserId),
        ),
      );

    const [{ inactive }] = await db
      .select({
        inactive: count(),
      })
      .from(addressPool)
      .where(
        and(
          eq(addressPool.network, network),
          eq(addressPool.status, "inactive"),
        ),
      );

    return {
      total: Number(total),
      assigned: Number(assigned),
      inactive: Number(inactive),
      available: Number(total) - Number(assigned) - Number(inactive),
    };
  }
}
