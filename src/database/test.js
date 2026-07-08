import { pool } from "./db.js";
import { logger } from "../utils/logger.js";

async function test() {
  try {
    await pool.query("SELECT NOW()");

    logger.info("✅ Database connected");

    process.exit(0);
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}

test();
