import { start } from "./user.controller.js";

export function registerStartCommand(bot) {
  bot.start(start);
}
