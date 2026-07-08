import { Markup } from "telegraf";

export function depositKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🟠 Bitcoin", "DEPOSIT_BTC")],
    [Markup.button.callback("🔵 USDT (TRC20)", "DEPOSIT_TRC20")],
    [Markup.button.callback("⬅️ Back", "MAIN_MENU")],
  ]);
}
