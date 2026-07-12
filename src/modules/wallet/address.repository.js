import { and, eq } from "drizzle-orm";

import { db } from "../../database/db.js";
import { userAddresses } from "../../database/schema/index.js";

export class AddressRepository {
  static async find(userId, network) {
    const [address] = await db
      .select()
      .from(userAddresses)
      .where(
        and(
          eq(userAddresses.userId, userId),
          eq(userAddresses.network, network),
        ),
      );

    return address ?? null;
  }

  static async create(data) {
    const [address] = await db.insert(userAddresses).values(data).returning();

    return address;
  }

  static async update(id, address) {
    const [updated] = await db
      .update(userAddresses)
      .set({
        address,
        updatedAt: new Date(),
      })
      .where(eq(userAddresses.id, id))
      .returning();

    return updated;
  }
}
