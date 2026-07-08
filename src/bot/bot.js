import { Telegraf } from "telegraf";

import { env } from "../config/env.js";
import { registerRoutes } from "./bot.routes.js";

export function createBot() {
  const bot = new Telegraf(env.BOT_TOKEN);

  bot.catch((error, ctx) => {
    console.error("Bot Error:", error);

    if (ctx?.reply) {
      ctx.reply("❌ Something went wrong. Please try again.");
    }
  });

  registerRoutes(bot);

  return bot;
}
