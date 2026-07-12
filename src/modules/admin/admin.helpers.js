import { getAdminState } from "./admin.state.js";
import { creditConfirmation } from "./admin.content.js";
import { confirmCreditKeyboard } from "./admin.keyboard.js";

export async function sendConfirmation(ctx) {
  const state = getAdminState(ctx.from.id);

  return ctx.reply(creditConfirmation(state), {
    parse_mode: "Markdown",
    reply_markup: confirmCreditKeyboard().reply_markup,
  });
}
