import { Markup } from "telegraf";

export function backKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Back to Main Menu", "MAIN_MENU")],
  ]);
}
