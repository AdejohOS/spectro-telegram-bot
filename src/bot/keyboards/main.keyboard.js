import { Markup } from "telegraf";
import { isAdmin } from "../../config/admin.js";

export function mainKeyboard(telegramId) {
  const keyboard = [
    [Markup.button.callback("💼 Escrow", "ESCROW_PANEL")],
    [
      Markup.button.callback("➕ Deposit", "DEPOSIT"),
      Markup.button.callback("➖ Withdrawal", "WITHDRAWAL_MENU"),
    ],
    [
      Markup.button.callback("👛 Wallet", "WALLET"),
      Markup.button.callback("🛒 Shop", "SHOP"),
    ],
    [
      Markup.button.callback("👤 Profile", "PROFILE"),
      Markup.button.callback("⚙️ Settings", "SETTINGS"),
    ],
    [
      Markup.button.callback("📖 Rules", "RULES"),
      Markup.button.callback("❓ Help", "HELP"),
    ],
    [
      Markup.button.url("🌐 Community", "https://t.me/Spectromileschat"),
      Markup.button.url("📞 Support", "https://t.me/Spectroassist"),
    ],
  ];

  if (isAdmin(telegramId)) {
    keyboard.push([Markup.button.callback("🛠 Admin Panel", "ADMIN_PANEL")]);
  }

  return Markup.inlineKeyboard(keyboard);
}
