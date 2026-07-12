import { depositLogs } from "../../database/schema/index.js";

export class DepositRepository {
  static async create(tx, data) {
    const [deposit] = await tx.insert(depositLogs).values(data).returning();

    return deposit;
  }
}
