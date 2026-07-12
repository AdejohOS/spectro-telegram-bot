export class AdminRepository {
  static async findPending(page = 1, limit = 10) {
    return db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, WITHDRAWAL_STATUS.PENDING))
      .limit(limit)
      .offset((page - 1) * limit);
  }
}
