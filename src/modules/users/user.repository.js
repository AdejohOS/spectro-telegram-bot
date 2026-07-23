import { eq } from "drizzle-orm";

import { db } from "../../database/db.js";
import { users } from "../../database/schema/index.js";

export class UserRepository {
  static async updateProfile(userId, data) {
    const [user] = await db
      .update(users)
      .set({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        languageCode: data.languageCode,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return user;
  }
  static async findByTelegramId(telegramId) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.telegramId, telegramId))
      .limit(1);

    return result[0] ?? null;
  }

  static async findById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    return user ?? null;
  }

  static async findByUsername(username) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return user ?? null;
  }

  static async findByAddress(address) {
    const [result] = await db
      .select()
      .from(addressPool)
      .where(eq(addressPool.address, address));

    return result ?? null;
  }

  static async create(data) {
    const result = await db.insert(users).values(data).returning();

    return result[0];
  }
  static async updateRole(userId, role) {
    const [user] = await db
      .update(users)
      .set({
        role,
      })
      .where(eq(users.id, userId))
      .returning();

    return user;
  }

  static async findAdmins() {
    return db.select().from(users).where(eq(users.role, "admin"));
  }

  static async updateStatus(userId, status) {
    const [user] = await db
      .update(users)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return user;
  }
}
