import { Markup } from "telegraf";

export function userDetailsKeyboard(user) {
  return Markup.inlineKeyboard([
    [
      user.status === "active"
        ? Markup.button.callback("🚫 Ban User", "BAN_USER")
        : Markup.button.callback("✅ Unban User", "UNBAN_USER"),
    ],

    [Markup.button.callback("⬅ Back", "USER_LOOKUP")],
  ]);
}
