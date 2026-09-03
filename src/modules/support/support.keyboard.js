import { Markup } from "telegraf";
import { Support } from "../../config/admins";

export function supportKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.url("💬 Contact Support", `https://t.me/${Support}`)],

    [Markup.button.url("🌍 Join Community", "https://t.me/Spectromileschat")],

    [Markup.button.callback("🏠 Back to Main Menu", "MAIN_MENU")],
  ]);
}
