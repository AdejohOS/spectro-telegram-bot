import { Markup } from "telegraf";

export function depositAddressKeyboard(network, address) {
  return Markup.inlineKeyboard([
    [Markup.button.copy("📋 Copy Address", address)],
    [
      Markup.button.callback(
        "✅ I Have Deposited",
        `CONFIRM_DEPOSIT:${network}`,
      ),
    ],
    [Markup.button.callback("⬅️ Back", "DEPOSIT")],
  ]);
}
