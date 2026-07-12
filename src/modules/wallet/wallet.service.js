import { WalletRepository } from "./wallet.repository.js";
import { db } from "../../database/db.js";
import { WalletTransactionRepository } from "./wallet.transaction.repository.js";
import { DepositRepository } from "../deposit/deposit.repository.js";
import { generateReference } from "../../utils/references.js";
import { REFERENCES } from "../../utils/references.js";
import {
  WALLET_TRANSACTION_TYPES,
  WALLET_ORDER_TYPES,
} from "../../utils/references.js";

export class WalletService {
  static async getWallet(userId) {
    return WalletRepository.findByUserId(userId);
  }

  static async createWallet(userId) {
    return WalletRepository.create(userId);
  }

  static async getOrCreateWallet(userId) {
    let wallet = await WalletRepository.findByUserId(userId);

    if (wallet) {
      return wallet;
    }

    return WalletRepository.create(userId);
  }

  static async credit({ userId, adminId, amount, addressId, txHash, notes }) {
    return db.transaction(async (tx) => {
      const wallet = await WalletRepository.findByUserIdTx(tx, userId);

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const balanceBefore = wallet.availableBalance;
      const balanceAfter = balanceBefore + amount;

      await WalletRepository.updateBalance(
        tx,
        wallet.id,
        balanceAfter,
        wallet.lockedBalance,
      );

      const reference = generateReference(REFERENCES.ADMIN_CREDIT);

      await WalletTransactionRepository.create(tx, {
        walletId: wallet.id,
        userId,
        type: "deposit",
        amount,
        balanceBefore,
        balanceAfter,
        reference,
        status: "completed",
        notes,
        createdBy: adminId,
      });

      await DepositRepository.create(tx, {
        userId,
        addressId,
        amount,
        txHash,
        status: "credited",
        creditedBy: adminId,
        creditedAt: new Date(),
        notes,
      });

      return WalletRepository.findByUserIdTx(tx, userId);
    });
  }

  static async lockFunds(tx, { userId, amount, reference, notes }) {
    const wallet = await WalletRepository.findByUserIdTx(tx, userId);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (wallet.availableBalance < amount) {
      throw new Error("Insufficient balance.");
    }

    const balanceBefore = wallet.availableBalance;

    const balanceAfter = balanceBefore - amount;

    const lockedAfter = wallet.lockedBalance + amount;

    await WalletRepository.updateBalance(
      tx,
      wallet.id,
      balanceAfter,
      lockedAfter,
    );

    await WalletTransactionRepository.create(tx, {
      walletId: wallet.id,

      userId,

      type: WALLET_TRANSACTION_TYPES.ESCROW_LOCK,

      amount,

      balanceBefore,

      balanceAfter,

      reference,

      status: "completed",

      notes,
    });

    return WalletRepository.findByUserIdTx(tx, userId);
  }
  static async releaseLockedFunds(
    tx,
    { buyerId, sellerId, amount, reference, notes },
  ) {
    const buyerWallet = await WalletRepository.findByUserIdTx(tx, buyerId);

    if (!buyerWallet) {
      throw new Error("Buyer wallet not found.");
    }

    const sellerWallet = await WalletRepository.findByUserIdTx(tx, sellerId);

    if (!sellerWallet) {
      throw new Error("Seller wallet not found.");
    }

    if (buyerWallet.lockedBalance < amount) {
      throw new Error("Locked balance is insufficient.");
    }

    // Remove locked funds from buyer
    await WalletRepository.updateBalance(
      tx,
      buyerWallet.id,
      buyerWallet.availableBalance,
      buyerWallet.lockedBalance - amount,
    );

    // Credit seller
    await WalletRepository.updateBalance(
      tx,
      sellerWallet.id,
      sellerWallet.availableBalance + amount,
      sellerWallet.lockedBalance,
    );

    // Buyer transaction
    await WalletTransactionRepository.create(tx, {
      walletId: buyerWallet.id,
      userId: buyerId,
      type: WALLET_TRANSACTION_TYPES.ESCROW_RELEASE,
      amount,
      balanceBefore: buyerWallet.availableBalance,
      balanceAfter: buyerWallet.availableBalance,
      reference: `${reference}-REL-BUYER`,
      status: "completed",
      notes,
    });

    // Seller transaction
    await WalletTransactionRepository.create(tx, {
      walletId: sellerWallet.id,
      userId: sellerId,
      type: WALLET_TRANSACTION_TYPES.ESCROW_PAYMENT,
      amount,
      balanceBefore: sellerWallet.availableBalance,
      balanceAfter: sellerWallet.availableBalance + amount,
      reference: `${reference}-REL-SELLER`,
      status: "completed",
      notes,
    });

    return true;
  }

  static async refundLockedFunds(tx, { buyerId, amount, reference, notes }) {
    const buyerWallet = await WalletRepository.findByUserIdTx(tx, buyerId);

    if (!buyerWallet) {
      throw new Error("Buyer wallet not found.");
    }

    if (buyerWallet.lockedBalance < amount) {
      throw new Error("Locked balance is insufficient.");
    }

    const availableAfter = buyerWallet.availableBalance + amount;

    const lockedAfter = buyerWallet.lockedBalance - amount;

    await WalletRepository.updateBalance(
      tx,
      buyerWallet.id,
      availableAfter,
      lockedAfter,
    );

    await WalletTransactionRepository.create(tx, {
      walletId: buyerWallet.id,

      userId: buyerId,

      type: WALLET_TRANSACTION_TYPES.ESCROW_REFUND,

      amount,

      balanceBefore: buyerWallet.availableBalance,

      balanceAfter: availableAfter,

      reference: `${reference}-REFUND`,

      status: "completed",

      notes,
    });

    return true;
  }
  static async lockWithdrawalFunds(tx, { userId, amount, reference, notes }) {
    const wallet = await WalletRepository.findByUserIdTx(tx, userId);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (wallet.availableBalance < amount) {
      throw new Error("Insufficient balance.");
    }

    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore - amount;
    const lockedAfter = wallet.lockedBalance + amount;

    await WalletRepository.updateBalance(
      tx,
      wallet.id,
      balanceAfter,
      lockedAfter,
    );

    await WalletTransactionRepository.create(tx, {
      walletId: wallet.id,
      userId,
      type: WALLET_TRANSACTION_TYPES.WITHDRAWAL,
      amount,
      balanceBefore,
      balanceAfter,
      reference: `${reference}-LOCK`,
      status: "pending",
      notes,
    });

    return true;
  }
  static async completeWithdrawal(tx, { userId, amount, reference, notes }) {
    const wallet = await WalletRepository.findByUserIdTx(tx, userId);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (wallet.lockedBalance < amount) {
      throw new Error("Locked balance is insufficient.");
    }

    await WalletRepository.updateBalance(
      tx,
      wallet.id,
      wallet.availableBalance,
      wallet.lockedBalance - amount,
    );

    await WalletTransactionRepository.create(tx, {
      walletId: wallet.id,
      userId,
      type: WALLET_TRANSACTION_TYPES.WITHDRAWAL,
      amount,
      balanceBefore: wallet.availableBalance,
      balanceAfter: wallet.availableBalance,
      reference: `${reference}-COMPLETE`,
      status: "completed",
      notes,
    });

    return true;
  }
  static async rejectWithdrawal(tx, { userId, amount, reference, notes }) {
    const wallet = await WalletRepository.findByUserIdTx(tx, userId);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (wallet.lockedBalance < amount) {
      throw new Error("Locked balance is insufficient.");
    }

    const availableAfter = wallet.availableBalance + amount;

    const lockedAfter = wallet.lockedBalance - amount;

    await WalletRepository.updateBalance(
      tx,
      wallet.id,
      availableAfter,
      lockedAfter,
    );

    await WalletTransactionRepository.create(tx, {
      walletId: wallet.id,
      userId,
      type: WALLET_TRANSACTION_TYPES.WITHDRAWAL,
      amount,
      balanceBefore: wallet.availableBalance,
      balanceAfter: availableAfter,
      reference: `${reference}-REJECT`,
      status: "completed",
      notes,
    });

    return true;
  }

  static async lockOrderFunds(tx, { userId, amount, reference, notes }) {
    const wallet = await WalletRepository.findByUserIdTx(tx, userId);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (wallet.availableBalance < amount) {
      throw new Error("Insufficient balance.");
    }

    const balanceBefore = Number(wallet.availableBalance);
    const lockedBalance = Number(wallet.lockedBalance);
    const transactionAmount = Number(amount);

    const balanceAfter = balanceBefore - transactionAmount;
    const lockedAfter = lockedBalance + transactionAmount;

    await WalletRepository.updateBalance(
      tx,
      wallet.id,
      balanceAfter,
      lockedAfter,
    );

    await WalletTransactionRepository.create(tx, {
      walletId: wallet.id,
      userId,
      type: WALLET_ORDER_TYPES.ORDER_LOCK,
      amount,
      balanceBefore,
      balanceAfter,
      reference,
      status: "completed",
      notes,
    });

    return WalletRepository.findByUserIdTx(tx, userId);
  }
  static async releaseOrderFunds(tx, { userId, amount, reference, notes }) {
    const wallet = await WalletRepository.findByUserIdTx(tx, userId);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (wallet.lockedBalance < amount) {
      throw new Error("Locked balance is insufficient.");
    }

    await WalletRepository.updateBalance(
      tx,
      wallet.id,
      wallet.availableBalance,
      wallet.lockedBalance - amount,
    );

    await WalletTransactionRepository.create(tx, {
      walletId: wallet.id,
      userId,
      type: WALLET_ORDER_TYPES.ORDER_RELEASE,
      amount,
      balanceBefore: wallet.availableBalance,
      balanceAfter: wallet.availableBalance,
      reference,
      status: "completed",
      notes,
    });

    return true;
  }
  static async refundOrderFunds(tx, { userId, amount, reference, notes }) {
    const wallet = await WalletRepository.findByUserIdTx(tx, userId);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    if (wallet.lockedBalance < amount) {
      throw new Error("Locked balance is insufficient.");
    }

    const availableAfter = wallet.availableBalance + amount;

    const lockedAfter = wallet.lockedBalance - amount;

    await WalletRepository.updateBalance(
      tx,
      wallet.id,
      availableAfter,
      lockedAfter,
    );

    await WalletTransactionRepository.create(tx, {
      walletId: wallet.id,
      userId,
      type: WALLET_ORDER_TYPES.ORDER_REFUND,
      amount,
      balanceBefore: wallet.availableBalance,
      balanceAfter: availableAfter,
      reference,
      status: "completed",
      notes,
    });

    return true;
  }
}
