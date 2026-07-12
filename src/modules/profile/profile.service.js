import { getUserByTelegramId } from "../../services/user.service.js";
import { WalletService } from "../wallet/wallet.service.js";

export async function getProfile(telegramId) {
  const user = await getUserByTelegramId(telegramId);

  if (!user) return null;

  const wallet = await WalletService.getWallet(user.id);

  return {
    user,
    wallet: {
      balance: wallet?.availableBalance ?? 0,
      locked: wallet?.lockedBalance ?? 0,
    },

    stats: {
      completed: 0,
      active: 0,
      cancelled: 0,
      disputes: 0,
      volume: 0,
    },

    reputation: {
      rating: 5.0,
      reviews: 0,
    },
  };
}
