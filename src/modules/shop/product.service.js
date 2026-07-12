import { ProductRepository } from "./product.repository.js";

export class ProductService {
  static async create(data) {
    return ProductRepository.create(data);
  }

  static async get(id) {
    return ProductRepository.findById(id);
  }

  static async update(id, data) {
    return ProductRepository.update(id, data);
  }

  static async list(page = 1) {
    const limit = 5;

    const products = await ProductRepository.findActive(page, limit);

    const total = await ProductRepository.countActive();

    return {
      products,
      total,
      page,
      limit,
    };
  }

  static async adminList(page = 1) {
    const limit = 5;

    const products = await ProductRepository.findAll(page, limit);

    const total = await ProductRepository.countAll();

    return {
      products,
      total,
      page,
      limit,
    };
  }
  static async getProduct(id) {
    return ProductRepository.findDetails(id);
  }
}
