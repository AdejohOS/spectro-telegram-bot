import { Markup } from "telegraf";

export function userDetailsKeyboard(user) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("💰 Credit", "ADMIN_CREDIT"),
      Markup.button.callback("💸 Debit", "ADMIN_DEBIT"),
    ],

    [
      user.status === "active"
        ? Markup.button.callback("🚫 Ban User", "BAN_USER")
        : Markup.button.callback("✅ Unban User", "UNBAN_USER"),
    ],

    [Markup.button.callback("⬅ Back", "USER_LOOKUP")],
  ]);
}
