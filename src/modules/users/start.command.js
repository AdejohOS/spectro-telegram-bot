import { menu, start } from "./user.controller.js";

export function registerStartCommand(bot) {
  bot.start(start);
  bot.command("menu", menu);
}
