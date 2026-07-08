import { logger } from "./utils/logger.js";
import { pool } from "./database/db.js";
import { createBot } from "./bot/bot.js";

async function bootstrap() {
  try {
    // Test database connection
    logger.info("Connecting to database...");
    await pool.query("SELECT NOW()");
    logger.info("✅ Database connected");

    // Create bot
    logger.info("Creating bot...");
    const bot = createBot();

    // Launch bot
    logger.info("Launching bot...");
    await bot.launch({
      dropPendingUpdates: true,
    });

    logger.info("🚀 Spectro Telegram Bot started");

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

bootstrap();
