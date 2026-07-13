import { db } from "../db.js";
import { addressPool } from "../schema/index.js";
import { count } from "drizzle-orm";

export async function seedAddresses() {
  const [{ total }] = await db.select({ total: count() }).from(addressPool);

  if (Number(total) > 0) {
    console.log("ℹ️ Address pool already seeded.");
    return;
  }

  await db.insert(addressPool).values([
    // Bitcoin
    {
      network: "BTC",
      address: "bc1qrp2fnf3gaqr7pwnkey0srynnhq08ergxqg5qqv",
    },
    {
      network: "BTC",
      address: "bc1qer2sk3052qgtqxpm6f93c25rp75t4d4aq3x8rz",
    },
    {
      network: "BTC",
      address: "bc1qzv7fdxr66k5mg4ljctvvf5vppew2838fuwegml",
    },

    // USDT TRC20
    {
      network: "TRC20",
      address: "TNqJJ1s3QiSfVsDcVHsRGZ8WwQXr6EU1gV",
    },
    {
      network: "TRC20",
      address: "TGqpNRpZWCZn7dMNv4wNVtgiPJR6YstqwU",
    },
    {
      network: "TRC20",
      address: "TYqDL7Tm8PK2ozm4MexYJFunKbD86dGTbQ",
    },
  ]);

  console.log("✅ Address pool seeded.");
}
