import { getUserByTelegramId } from "./user.service.js";

export async function getProfile(telegramId) {
  const user = await getUserByTelegramId(telegramId);

  if (!user) return null;

  return {
    user,

    wallet: {
      balance: 0,
      pending: 0,
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
