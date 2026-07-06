import "dotenv/config";

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db.js";

await migrate(db, {
  migrationsFolder: "./src/database/migrations",
});

console.log("✅ Database migrated successfully");
