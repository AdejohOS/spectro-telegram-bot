import { db } from "../../database/db.js";
import { products } from "../../database/schema/index.js";
import { eq, desc, count } from "drizzle-orm";
import { PRODUCT_STATUS } from "./product.status.js";

export class ProductRepository {
  static async create(data) {
    const [product] = await db.insert(products).values(data).returning();

    return product;
  }

  static async findById(id) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    return product ?? null;
  }

  static async update(id, data) {
    const [product] = await db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return product;
  }

  static async findActive(page = 1, limit = 5) {
    return db
      .select()
      .from(products)
      .where(eq(products.status, PRODUCT_STATUS.ACTIVE))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  }

  static async countActive() {
    const result = await db
      .select({
        total: count(),
      })
      .from(products)
      .where(eq(products.status, PRODUCT_STATUS.ACTIVE));

    return Number(result[0].total);
  }

  static async findAll(page = 1, limit = 5) {
    return db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  }

  static async countAll() {
    const result = await db
      .select({
        total: count(),
      })
      .from(products);

    return Number(result[0].total);
  }
  static async findDetails(id) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    return product ?? null;
  }
}
