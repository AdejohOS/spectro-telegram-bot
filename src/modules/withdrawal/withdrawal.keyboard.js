import { Markup } from "telegraf";

export function withdrawalMenuKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("💸 New Withdrawal", "WITHDRAW")],

    [Markup.button.callback("📒 Saved Addresses", "SAVED_ADDRESSES")],

    [Markup.button.callback("📜 Withdrawal History", "WITHDRAW_HISTORY")],

    [Markup.button.callback("⬅ Back to Main Menu", "MAIN_MENU")],
  ]);
}

export function withdrawalConfirmKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ Confirm", "WITHDRAW_CONFIRM")],

    [Markup.button.callback("✏️ Change Address", "CHANGE_WITHDRAW_ADDRESS")],

    [Markup.button.callback("❌ Cancel", "CANCEL_WITHDRAWAL")],
  ]);
}

export function withdrawalNetworkKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("USDT TRC20", "WITHDRAW_NETWORK:TRC20")],

    [Markup.button.callback("BTC", "WITHDRAW_NETWORK:BTC")],

    [Markup.button.callback("⬅ Back", "WALLET")],
  ]);
}
