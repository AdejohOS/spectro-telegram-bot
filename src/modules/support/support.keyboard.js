import { Markup } from "telegraf";

export function supportKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.url("💬 Contact Support", "https://t.me/Codyred")],

    [Markup.button.url("🌍 Join Community", "https://t.me/Spectromileschat")],

    [Markup.button.callback("🏠 Back to Main Menu", "MAIN_MENU")],
  ]);
}
