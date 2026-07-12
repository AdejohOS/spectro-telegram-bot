import { db } from "../../database/db.js";
import { walletTransactions } from "../../database/schema/index.js";

export class WalletTransactionRepository {
  static async create(tx, data) {
    const [transaction] = await tx
      .insert(walletTransactions)
      .values(data)
      .returning();

    return transaction;
  }
}
