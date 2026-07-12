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
    } else if (user.role !== role) {
      user = await UserRepository.updateRole(user.id, role);
    }

    await WalletService.getOrCreateWallet(user.id);

    return user;
  }
}
