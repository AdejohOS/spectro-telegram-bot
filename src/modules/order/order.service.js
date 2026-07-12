import { db } from "../../database/db.js";

import { ProductRepository } from "../shop/product.repository.js";

import { OrderRepository } from "./order.repository.js";

import { WalletService } from "../wallet/wallet.service.js";

import { UserRepository } from "../users/user.repository.js";

import { generateReference, REFERENCES } from "../../utils/references.js";

import { ORDER_STATUS } from "../shop/product.status.js";

export class OrderService {
  static async create(productId, telegramId) {
    const buyer = await UserRepository.findByTelegramId(telegramId);

    if (!buyer) {
      throw new Error("Buyer not found.");
    }

    return db.transaction(async (tx) => {
      const product = await ProductRepository.findById(productId);

      if (!product) {
        throw new Error("Product not found.");
      }

      if (product.stock <= 0) {
        throw new Error("Product is out of stock.");
      }

      const reference = generateReference(REFERENCES.ORDER);

      await WalletService.lockOrderFunds(tx, {
        userId: buyer.id,

        amount: product.price,

        reference,

        notes: `Order ${product.title}`,
      });

      await ProductRepository.update(product.id, {
        stock: product.stock - 1,
      });

      return OrderRepository.create(tx, {
        orderNumber: reference,

        buyerId: buyer.id,

        productId: product.id,
        productTitle: product.title,

        amount: product.price,

        status: ORDER_STATUS.PENDING,

        lockedAt: new Date(),
      });
    });
  }
  static async getOrder(id) {
    return OrderRepository.findDetails(id);
  }
  static async adminList(status, page = 1) {
    const limit = 5;

    const orders = await OrderRepository.findByStatusPag(status, page, limit);

    const total = await OrderRepository.countByStatus(status);

    return {
      orders,
      total,
      page,
      limit,
    };
  }
}
