import { getUserByTelegramId } from "../../services/user.service.js";
import { WalletService } from "../wallet/wallet.service.js";
import { EscrowService } from "../escrow/escrow.service.js";

export async function getProfile(telegramId) {
  const user = await getUserByTelegramId(telegramId);

  if (!user) return null;

  const wallet = await WalletService.getWallet(user.id);
  const escrowSummary = await EscrowService.getHistorySummary(telegramId);

  return {
    user,
    wallet: {
      balance: wallet?.availableBalance ?? 0,
      locked: wallet?.lockedBalance ?? 0,
    },

    stats: {
      completed: escrowSummary.completed,
      active: escrowSummary.active,
      rejected: escrowSummary.rejected,
      disputes: escrowSummary.disputed,
    },
  };
}
