import { UserRepository } from "./user.repository.js";
import { WalletService } from "../wallet/wallet.service.js";

export class UserService {
  static async registerTelegramUser(telegramUser) {
    let user = await UserRepository.findByTelegramId(telegramUser.id);

    if (!user) {
      user = await UserRepository.create({
        telegramId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
      });
    }

    await WalletService.getOrCreateWallet(user.id);

    return user;
  }
}
