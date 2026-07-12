import { db } from "../../database/db.js";
import { generateReference, REFERENCES } from "../../utils/references.js";
import { UserRepository } from "../users/user.repository.js";
import { WalletService } from "../wallet/wallet.service.js";
import { WITHDRAWAL_STATUS } from "./withdrawal.status.js";
import { WithdrawalRepository } from "./withdrawal.repository.js";

export class WithdrawalService {
  static async create(telegramId, state) {
    if (!state?.amount || !state?.network || !state?.address) {
      throw new Error("Incomplete withdrawal request.");
    }

    const user = await UserRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found.");
    }

    return db.transaction(async (tx) => {
      const reference = generateReference(REFERENCES.WITHDRAWAL);

      // Lock the funds using WalletService
      await WalletService.lockWithdrawalFunds(tx, {
        userId: user.id,
        amount: state.amount,
        reference,
        notes: `${state.network} withdrawal`,
      });

      // Create withdrawal request
      const withdrawal = await WithdrawalRepository.create(tx, {
        userId: user.id,
        amount: state.amount,
        network: state.network,
        address: state.address,
        reference,
        status: WITHDRAWAL_STATUS.PENDING,
      });

      return withdrawal;
    });
  }
  static async listByStatus(status, page = 1, limit = 5) {
    const withdrawals = await WithdrawalRepository.findByStatusPag(
      status,
      page,
      limit,
    );

    const total = await WithdrawalRepository.countByStatus(status);

    return {
      withdrawals,
      total,
      page,
      limit,
    };
  }
  static async getWithdrawal(id) {
    return WithdrawalRepository.findDetails(id);
  }
  static async approve(withdrawalId, adminTelegramId) {
    const admin = await UserRepository.findByTelegramId(adminTelegramId);

    if (!admin) {
      throw new Error("Admin not found.");
    }

    return db.transaction(async (tx) => {
      const withdrawal = await WithdrawalRepository.findByIdTx(
        tx,
        withdrawalId,
      );

      if (!withdrawal) {
        throw new Error("Withdrawal not found.");
      }

      if (withdrawal.status !== WITHDRAWAL_STATUS.PENDING) {
        throw new Error("Withdrawal has already been processed.");
      }

      await WalletService.completeWithdrawal(tx, {
        userId: withdrawal.userId,
        amount: withdrawal.amount,
        reference: withdrawal.reference,
        notes: "Withdrawal Approved",
      });

      const updated = await WithdrawalRepository.update(tx, withdrawal.id, {
        status: WITHDRAWAL_STATUS.COMPLETED,
        approvedBy: admin.id,
        approvedAt: new Date(),
        completedAt: new Date(),
      });

      return updated;
    });
  }
  static async reject(withdrawalId, adminTelegramId) {
    const admin = await UserRepository.findByTelegramId(adminTelegramId);

    if (!admin) {
      throw new Error("Admin not found.");
    }

    return db.transaction(async (tx) => {
      const withdrawal = await WithdrawalRepository.findByIdTx(
        tx,
        withdrawalId,
      );

      if (!withdrawal) {
        throw new Error("Withdrawal not found.");
      }

      if (withdrawal.status !== WITHDRAWAL_STATUS.PENDING) {
        throw new Error("Withdrawal has already been processed.");
      }

      await WalletService.rejectWithdrawal(tx, {
        userId: withdrawal.userId,
        amount: withdrawal.amount,
        reference: withdrawal.reference,
        notes: "Withdrawal Rejected",
      });

      const updated = await WithdrawalRepository.update(tx, withdrawal.id, {
        status: WITHDRAWAL_STATUS.REJECTED,
        rejectedBy: admin.id,
        rejectedAt: new Date(),
      });

      return updated;
    });
  }
}
