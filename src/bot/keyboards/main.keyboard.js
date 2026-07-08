import { Markup } from "telegraf";

export function mainKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("💼 Create Escrow", "CREATE_ESCROW")],
    [
      Markup.button.callback("💵 Deposit", "DEPOSIT"),
      Markup.button.callback("🛒 Shop", "SHOP"),
    ],
    [
      Markup.button.callback("👛 Wallet", "WALLET"),
      Markup.button.callback("📜 History", "HISTORY"),
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
      Markup.button.callback("🌐 Community", "COMMUNITY"),
      Markup.button.callback("📞 Support", "SUPPORT"),
    ],
  ]);
}
