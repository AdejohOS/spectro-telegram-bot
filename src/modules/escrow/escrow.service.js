import { EscrowRepository } from "./escrow.repository.js";
import { generateEscrowNumber } from "../../utils/escrow-number.js";
import { UserRepository } from "../users/user.repository.js";
import { ESCROW_STATUS } from "../../utils/references.js";
import { EscrowEventRepository } from "./escrow.event.repository.js";
import { ESCROW_EVENTS } from "../../utils/references.js";
import { db } from "../../database/db.js";
import { WalletService } from "../wallet/wallet.service.js";

export class EscrowService {
  static async create({ buyerId, sellerId, amount, title, description }) {
    return db.transaction(async (tx) => {
      const escrowNumber = generateEscrowNumber();

      await WalletService.lockFunds(tx, {
        userId: buyerId,
        amount,
        reference: escrowNumber,
        notes: "Escrow Funding",
      });

      const escrow = await EscrowRepository.createTx(tx, {
        escrowNumber,
        buyerId,
        sellerId,
        amount,
        title,
        description,
        createdBy: buyerId,
        status: ESCROW_STATUS.PENDING_SELLER,
      });

      console.log("Escrow status:", escrow.status);

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,
        userId: buyerId,
        event: ESCROW_EVENTS.CREATED,
      });

      return escrow;
    });
  }

  static async acceptEscrow(escrowId, sellerId) {
    return db.transaction(async (tx) => {
      const escrow = await EscrowRepository.findByIdTx(tx, escrowId);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.sellerId !== sellerId) {
        throw new Error("Unauthorized.");
      }

      if (escrow.status !== ESCROW_STATUS.PENDING_SELLER) {
        throw new Error("Escrow is no longer pending.");
      }

      const updated = await EscrowRepository.update(tx, escrow.id, {
        status: ESCROW_STATUS.ACCEPTED,
      });

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,
        userId: sellerId,
        event: ESCROW_EVENTS.ACCEPTED,
      });

      return updated;
    });
  }

  static async getPending(telegramId) {
    const user = await UserRepository.findByTelegramId(telegramId);

    return EscrowRepository.findPending(user.id);
  }
  static async getEscrow(id) {
    return EscrowRepository.findDetails(id);
  }

  static async reject(escrowId, sellerId) {
    return db.transaction(async (tx) => {
      const escrow = await EscrowRepository.findByIdTx(tx, escrowId);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.sellerId !== sellerId) {
        throw new Error("Unauthorized.");
      }

      if (escrow.status !== ESCROW_STATUS.PENDING_SELLER) {
        throw new Error("Escrow is no longer pending.");
      }

      await WalletService.refundLockedFunds(tx, {
        buyerId: escrow.buyerId,
        amount: escrow.amount,
        reference: escrow.escrowNumber,
        notes: "Seller rejected escrow",
      });

      const updated = await EscrowRepository.update(tx, escrow.id, {
        status: ESCROW_STATUS.REJECTED,
      });

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,

        userId: sellerId,

        event: ESCROW_EVENTS.REJECTED,
      });

      return updated;
    });
  }

  static async cancelPending(escrowId, buyerTelegramId) {
    const buyer = await UserRepository.findByTelegramId(buyerTelegramId);

    return db.transaction(async (tx) => {
      const escrow = await EscrowRepository.findByIdTx(tx, escrowId);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.buyerId !== buyer.id) {
        throw new Error("Unauthorized.");
      }

      if (escrow.status !== ESCROW_STATUS.PENDING_SELLER) {
        throw new Error("Escrow can only be cancelled before seller accepts.");
      }

      await WalletService.refundLockedFunds(tx, {
        buyerId: escrow.buyerId,
        amount: escrow.amount,
        reference: escrow.escrowNumber,
        notes: "Buyer cancelled escrow before seller accepted",
      });

      const updated = await EscrowRepository.update(tx, escrow.id, {
        status: ESCROW_STATUS.CANCELLED,
      });

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,
        userId: buyer.id,
        event: ESCROW_EVENTS.CANCELLED,
      });

      return updated;
    });
  }

  static async deliver(escrowId, sellerTelegramId) {
    const seller = await UserRepository.findByTelegramId(sellerTelegramId);

    return db.transaction(async (tx) => {
      const escrow = await EscrowRepository.findByIdTx(tx, escrowId);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.sellerId !== seller.id) {
        throw new Error("Unauthorized.");
      }

      if (escrow.status !== ESCROW_STATUS.ACCEPTED) {
        throw new Error("Escrow is not ready for delivery");
      }

      const updated = await EscrowRepository.update(tx, escrow.id, {
        status: ESCROW_STATUS.DELIVERED,
      });

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,

        userId: seller.id,

        event: ESCROW_EVENTS.DELIVERED,
      });

      return updated;
    });
  }
  static async release(escrowId, buyerTelegramId) {
    const buyer = await UserRepository.findByTelegramId(buyerTelegramId);

    return db.transaction(async (tx) => {
      const escrow = await EscrowRepository.findByIdTx(tx, escrowId);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.buyerId !== buyer.id) {
        throw new Error("Unauthorized.");
      }

      if (escrow.status !== ESCROW_STATUS.DELIVERED) {
        throw new Error("Escrow is not ready for release.");
      }

      await WalletService.releaseLockedFunds(tx, {
        buyerId: escrow.buyerId,

        sellerId: escrow.sellerId,

        amount: escrow.amount,

        reference: escrow.escrowNumber,

        notes: "Escrow Released",
      });

      const updated = await EscrowRepository.update(tx, escrow.id, {
        status: ESCROW_STATUS.COMPLETED,

        releasedBy: buyer.id,

        releasedAt: new Date(),
      });

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,

        userId: buyer.id,

        event: ESCROW_EVENTS.RELEASED,
      });

      return updated;
    });
  }

  static async getCompleted(telegramId) {
    const user = await UserRepository.findByTelegramId(telegramId);

    return EscrowRepository.findByStatus(user.id, ESCROW_STATUS.COMPLETED);
  }

  static async getRejected(telegramId) {
    const user = await UserRepository.findByTelegramId(telegramId);

    return EscrowRepository.findByStatus(user.id, ESCROW_STATUS.REJECTED);
  }

  static async getDisputed(telegramId) {
    const user = await UserRepository.findByTelegramId(telegramId);

    return EscrowRepository.findByStatus(user.id, ESCROW_STATUS.DISPUTED);
  }

  // For pagination

  static async getActive(telegramId, page = 1) {
    const user = await UserRepository.findByTelegramId(telegramId);

    const limit = 5;

    const escrows = await EscrowRepository.findByActivePag(
      user.id,
      page,
      limit,
    );

    const total = await EscrowRepository.countActive(user.id);

    return {
      escrows,
      total,
      page,
      limit,
    };
  }

  static async listByStatus(telegramId, status, page = 1, limit = 5) {
    const user = await UserRepository.findByTelegramId(telegramId);

    const escrows = await EscrowRepository.findByStatusPag(
      user.id,
      status,
      page,
      limit,
    );

    const total = await EscrowRepository.countByStatus(user.id, status);

    return {
      escrows,
      total,
      page,
      limit,
    };
  }

  // normal check
  static async getHistorySummary(telegramId) {
    const user = await UserRepository.findByTelegramId(telegramId);

    const rows = await EscrowRepository.getSummary(user.id);

    const summary = {
      pending: 0,

      funding: 0,

      active: 0,

      completed: 0,

      rejected: 0,

      cancelled: 0,

      disputed: 0,
    };

    for (const row of rows) {
      switch (row.status) {
        case ESCROW_STATUS.PENDING_SELLER:
          summary.pending = Number(row.total);

          break;

        case ESCROW_STATUS.ACCEPTED:

        case ESCROW_STATUS.DELIVERED:
          summary.active += Number(row.total);

          break;

        case ESCROW_STATUS.COMPLETED:
          summary.completed = Number(row.total);

          break;

        case ESCROW_STATUS.REJECTED:
          summary.rejected = Number(row.total);

          break;

        case ESCROW_STATUS.CANCELLED:
          summary.cancelled = Number(row.total);

          break;

        case ESCROW_STATUS.DISPUTED:
          summary.disputed = Number(row.total);

          break;
      }
    }

    return summary;
  }

  static async openDispute(escrowId, telegramId, reason) {
    return db.transaction(async (tx) => {
      const user = await UserRepository.findByTelegramId(telegramId);

      const escrow = await EscrowRepository.findById(escrowId);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      const participant =
        escrow.buyerId === user.id || escrow.sellerId === user.id;

      if (!participant) {
        throw new Error("Unauthorized.");
      }

      if (
        escrow.status !== ESCROW_STATUS.ACCEPTED &&
        escrow.status !== ESCROW_STATUS.DELIVERED
      ) {
        throw new Error("Disputes can only be opened after funding.");
      }

      const updated = await EscrowRepository.update(tx, escrow.id, {
        status: ESCROW_STATUS.DISPUTED,

        disputedBy: user.id,

        disputeReason: reason,

        disputedAt: new Date(),
      });

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,

        userId: user.id,

        event: "Dispute Opened",

        notes: reason,
      });

      return updated;
    });
  }

  static async getPendingDisputes(page = 1) {
    const limit = 5;

    const escrows = await EscrowRepository.findPendingDisputes(
      page,

      limit,
    );

    const total = await EscrowRepository.countPendingDisputes();

    return {
      escrows,

      page,

      limit,

      total,
    };
  }

  static async adminRelease(escrowId, adminTelegramId) {
    const admin = await UserRepository.findByTelegramId(adminTelegramId);

    return db.transaction(async (tx) => {
      const escrow = await EscrowRepository.findByIdTx(tx, escrowId);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.status !== ESCROW_STATUS.DISPUTED) {
        throw new Error("Escrow is not under dispute.");
      }

      await WalletService.releaseLockedFunds(tx, {
        buyerId: escrow.buyerId,

        sellerId: escrow.sellerId,

        amount: escrow.amount,

        reference: escrow.escrowNumber,

        notes: "Admin released escrow after dispute",
      });

      const updated = await EscrowRepository.update(tx, escrow.id, {
        status: ESCROW_STATUS.COMPLETED,

        resolvedBy: admin.id,

        resolvedAt: new Date(),
      });

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,

        userId: admin.id,

        event: "Admin Released Funds",
      });

      return await EscrowRepository.findDetails(escrow.id);
    });
  }
  static async adminRefund(escrowId, adminTelegramId) {
    const admin = await UserRepository.findByTelegramId(adminTelegramId);

    return db.transaction(async (tx) => {
      const escrow = await EscrowRepository.findByIdTx(tx, escrowId);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.status !== ESCROW_STATUS.DISPUTED) {
        throw new Error("Escrow is not under dispute.");
      }

      await WalletService.refundLockedFunds(tx, {
        buyerId: escrow.buyerId,

        amount: escrow.amount,

        reference: escrow.escrowNumber,

        notes: "Admin refunded buyer after dispute",
      });

      const updated = await EscrowRepository.update(tx, escrow.id, {
        status: ESCROW_STATUS.REFUNDED,

        resolvedBy: admin.id,

        resolvedAt: new Date(),
      });

      await EscrowEventRepository.create(tx, {
        escrowId: escrow.id,

        userId: admin.id,

        event: "Admin Refunded Buyer",
      });

      return await EscrowRepository.findDetails(escrow.id);
    });
  }
}
