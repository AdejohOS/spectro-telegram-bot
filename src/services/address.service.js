import { db } from "../database/db.js";
import { addressPool } from "../database/schema/index.js";
import { eq, isNull, and } from "drizzle-orm";

export async function getOrAssignAddress(userId, network) {
  // Check if user already has an address for this network
  let [address] = await db
    .select()
    .from(addressPool)
    .where(
      and(
        eq(addressPool.assignedUserId, userId),
        eq(addressPool.network, network),
      ),
    )
    .limit(1);

  if (address) {
    return address;
  }

  // Get the first available address
  [address] = await db
    .select()
    .from(addressPool)
    .where(
      and(eq(addressPool.network, network), isNull(addressPool.assignedUserId)),
    )
    .limit(1);

  if (!address) {
    throw new Error(`No ${network} addresses available.`);
  }

  // Assign it to the user
  const [assigned] = await db
    .update(addressPool)
    .set({
      assignedUserId: userId,
      assignedAt: new Date(),
    })
    .where(eq(addressPool.id, address.id))
    .returning();

  return assigned;
}
