import { Markup } from "telegraf";

export function userDetailsKeyboard(user) {
  return Markup.inlineKeyboard([
    [
      user.status === "active"
        ? Markup.button.callback("🚫 Ban User", "BAN_USER")
        : Markup.button.callback("✅ Unban User", "UNBAN_USER"),
    ],
    [
      Markup.button.callback(
        "📜 Transaction History",
        `USER_TRANSACTIONS:${user.id}:1`,
      ),
    ],
    [Markup.button.callback("⬅ Back", "USER_LOOKUP")],
  ]);
}

export function userTransactionsKeyboard(userId, page, totalPages) {
  const buttons = [];

  const navigation = [];

  if (page > 1) {
    navigation.push(
      Markup.button.callback(
        "⬅ Previous",
        `USER_TRANSACTIONS:${userId}:${page - 1}`,
      ),
    );
  }

  if (page < totalPages) {
    navigation.push(
      Markup.button.callback(
        "Next ➡",
        `USER_TRANSACTIONS:${userId}:${page + 1}`,
      ),
    );
  }

  if (navigation.length) {
    buttons.push(navigation);
  }

  buttons.push([
    Markup.button.callback("⬅ Back to User", `BACK_TO_USER:${userId}`),
  ]);

  return Markup.inlineKeyboard(buttons);
}
