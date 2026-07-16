import { UserRepository } from "./user.repository.js";
import { WalletService } from "../wallet/wallet.service.js";
import { isAdmin } from "../../config/admin.js";

export class UserService {
  static async registerTelegramUser(telegramUser) {
    let user = await UserRepository.findByTelegramId(telegramUser.id);

    const role = isAdmin(telegramUser.id) ? "admin" : "user";

    if (!user) {
      user = await UserRepository.create({
        telegramId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
        role,
      });
    } else if (
      user.username !== telegramUser.username ||
      user.firstName !== telegramUser.first_name ||
      user.lastName !== telegramUser.last_name ||
      user.languageCode !== telegramUser.language_code ||
      user.role !== role
    ) {
      user = await UserRepository.updateProfile(user.id, {
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
        role,
      });
    }

    await WalletService.getOrCreateWallet(user.id);

    return user;
  }
}
