import { Markup } from "telegraf";
export function helpKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("💰 Deposits", "FAQ_DEPOSITS")],
    [Markup.button.callback("💸 Withdrawals", "FAQ_WITHDRAWALS")],
    [Markup.button.callback("🤝 Escrow", "FAQ_ESCROW")],
    [Markup.button.callback("🛒 Shop", "FAQ_SHOP")],
    [Markup.button.callback("🔐 Account & Security", "FAQ_SECURITY")],
    [Markup.button.callback("📞 Contact Support", "SUPPORT")],
    [Markup.button.callback("⬅ Main Menu", "MAIN_MENU")],
  ]);
}
