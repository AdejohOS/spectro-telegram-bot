import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { appSettings } from "../../database/schema/index.js";

export class AdminSettingsRepository {
  static async get(key) {
    const [setting] = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, key))
      .limit(1);

    return setting?.value ?? null;
  }

  static async set(key, value) {
    const [setting] = await db
      .insert(appSettings)
      .values({
        key,
        value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: {
          value,
          updatedAt: new Date(),
        },
      })
      .returning();

    return setting;
  }

  static async getSupportSettings() {
    const username = await this.get("support_username");

    return {
      username,
    };
  }
}
