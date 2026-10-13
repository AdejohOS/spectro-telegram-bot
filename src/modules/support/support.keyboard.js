import { Markup } from "telegraf";

export function supportKeyboard(supportLink) {
  return Markup.inlineKeyboard([
    [Markup.button.url("💬 Contact Support", supportLink)],

    [Markup.button.url("🌍 Join Community", "https://t.me/Spectromileschat")],

    [Markup.button.callback("🏠 Back to Main Menu", "MAIN_MENU")],
  ]);
}
