import { escrowEvents } from "../../database/schema/index.js";

export class EscrowEventRepository {
  static async create(tx, data) {
    const [event] = await tx.insert(escrowEvents).values(data).returning();

    return event;
  }
}
