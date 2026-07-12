import { AddressRepository } from "./address.repository.js";

export class AddressService {
  static async get(userId, network) {
    return AddressRepository.find(userId, network);
  }

  static async save(userId, network, address) {
    const existing = await AddressRepository.find(userId, network);

    if (existing) {
      return AddressRepository.update(existing.id, address);
    }

    return AddressRepository.create({
      userId,
      network,
      address,
    });
  }
}
