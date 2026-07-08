import { eq } from "drizzle-orm";

import { db } from "../database/db.js";
import { wallets } from "../database/schema/index.js";

export async function getWallet(userId) {
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId));

  return wallet ?? null;
}

export async function createWallet(userId) {
  const [wallet] = await db
    .insert(wallets)
    .values({
      userId,
    })
    .returning();

  return wallet;
}

export async function getOrCreateWallet(userId) {
  let wallet = await getWallet(userId);

  if (wallet) {
    return wallet;
  }

  return createWallet(userId);
}
