import { UserRepository } from "../users/user.repository.js";
import { AddressRepository } from "../address/address.repository.js";
import { WalletService } from "../wallet/wallet.service.js";

export class AdminService {
  static async findUser(searchType, value) {
    if (searchType === "username") {
      return UserRepository.findByUsername(value);
    }

    if (searchType === "address") {
      const address = await AddressRepository.findByAddress(value);

      if (!address) {
        return null;
      }

      return UserRepository.findById(address.assignedUserId);
    }

    return null;
  }

  static async creditWallet(state, adminTelegramId) {
    let addressId = state.addressId;

    if (!addressId) {
      const address = await AddressRepository.findUserAddress(
        state.user.id,
        state.network,
      );

      if (!address) {
        throw new Error("User has no address for this network.");
      }

      addressId = address.id;
    }

    // Find the admin user in the database
    const admin = await UserRepository.findByTelegramId(adminTelegramId);

    if (!admin) {
      throw new Error("Admin user not found.");
    }

    return WalletService.credit({
      userId: state.user.id,
      adminId: admin.id, // ✅ UUID from the users table
      amount: state.amount,
      addressId,
      txHash: state.txHash,
      notes: state.notes,
    });
  }
}
