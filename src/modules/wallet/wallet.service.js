import { WalletRepository } from "./wallet.repository.js";

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
}
