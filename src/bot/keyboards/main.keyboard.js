import { Markup } from "telegraf";
import { isAdmin } from "../../config/admin.js";

export function mainKeyboard(telegramId) {
  const keyboard = [
    [Markup.button.callback("💼 Escrow", "ESCROW_PANEL")],
    [
      Markup.button.callback("➕ Deposit", "DEPOSIT"),
      Markup.button.callback("➖ Withdrawal", "WITHDRAWAL_MENU"),
    ],
    [Markup.button.callback("🛒 Shop", "SHOP")],
    [Markup.button.callback("👤 Profile", "PROFILE")],
    [
      Markup.button.callback("📖 Rules", "RULES"),
      Markup.button.callback("❓ Help/FAQ", "FAQ"),
    ],
    [Markup.button.callback("📞 Support", "SUPPORT")],
  ];

  if (isAdmin(telegramId)) {
    keyboard.push([Markup.button.callback("🛠 Admin Panel", "ADMIN_PANEL")]);
  }

  return Markup.inlineKeyboard(keyboard);
}
