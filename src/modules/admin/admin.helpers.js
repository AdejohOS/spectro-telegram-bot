import { getAdminState } from "./admin.state.js";
import { walletConfirmation } from "./admin.content.js";
import { confirmWalletActionKeyboard } from "./admin.keyboard.js";

export async function sendConfirmation(ctx) {
  const state = getAdminState(ctx.from.id);

  return ctx.reply(walletConfirmation(state), {
    parse_mode: "HTML",
    reply_markup: confirmWalletActionKeyboard().reply_markup,
  });
}
