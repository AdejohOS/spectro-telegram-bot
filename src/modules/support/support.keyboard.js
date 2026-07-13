import { Markup } from "telegraf";

export function supportKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.url("💬 Contact Support", "https://t.me/SpectroAssist")],

    [Markup.button.url("🌍 Join Community", "https://t.me/Spectromileschat")],

    [Markup.button.callback("🏠 Back to Main Menu", "MAIN_MENU")],
  ]);
}
