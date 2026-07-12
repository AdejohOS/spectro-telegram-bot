import { AddressRepository } from "./address.repository.js";

export class AddressService {
  static async getOrAssignAddress(userId, network) {
    // Has the user already been assigned one?
    const existing = await AddressRepository.findUserAddress(userId, network);

    if (existing) {
      return existing;
    }

    // Find an unused address
    const available = await AddressRepository.findAvailableAddress(network);

    if (!available) {
      throw new Error("NO_AVAILABLE_ADDRESS");
    }

    // Assign it
    return AddressRepository.assignAddress(available.id, userId);
  }
}
