import { and, eq, isNull } from "drizzle-orm";

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
}
