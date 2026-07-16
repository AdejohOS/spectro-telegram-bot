import { Markup } from "telegraf";

export function depositKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("₿ Bitcoin (BTC)", "DEPOSIT_BTC")],
    [Markup.button.callback("💵 USDT (TRC20)", "DEPOSIT_TRC20")],
    [Markup.button.callback("⬅️ Back to Main Menu", "MAIN_MENU")],
  ]);
}

export function depositAddressKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ I Have Deposited", "I_HAVE_DEPOSITED")],
    [Markup.button.callback("⬅ Back", "DEPOSIT")],
  ]);
}
