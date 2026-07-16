import { Markup } from "telegraf";

export function userLookupKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("👤 Username", "LOOKUP_USERNAME"),
      Markup.button.callback("🏦 Address", "LOOKUP_ADDRESS"),
    ],
    [Markup.button.callback("⬅ Back", "ADMIN_PANEL")],
  ]);
}
