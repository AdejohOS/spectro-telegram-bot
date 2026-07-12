import { Markup } from "telegraf";

export function adminKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("💳 Credit Wallet", "ADMIN_CREDIT")],
    [Markup.button.callback("⏳ Disputes", "ADMIN_DISPUTES")],
    [
      Markup.button.callback("💸 Withdrawals", "ADMIN_WITHDRAWALS"),
      Markup.button.callback("👥 Users", "ADMIN_USERS"),
    ],

    [Markup.button.callback("📦 Shop", "ADMIN_PRODUCTS")],

    [Markup.button.callback("📊 Statistics", "ADMIN_STATS")],

    [Markup.button.callback("⬅️ Back to Main Menu", "MAIN_MENU")],
  ]);
}

export function searchUserKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("👤 Username", "SEARCH_USERNAME")],

    [Markup.button.callback("🏦 Deposit Address", "SEARCH_ADDRESS")],

    [Markup.button.callback("⬅️ Back", "ADMIN_PANEL")],
  ]);
}

export function networkKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("₿ BTC", "NETWORK_BTC"),
      Markup.button.callback("💵 TRC20", "NETWORK_TRC20"),
    ],
  ]);
}

export function confirmCreditKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ Confirm", "CONFIRM_CREDIT")],
    [Markup.button.callback("❌ Cancel", "CANCEL_CREDIT")],
  ]);
}
export function skipKeyboard(callback) {
  return Markup.inlineKeyboard([[Markup.button.callback("⏭ Skip", callback)]]);
}
