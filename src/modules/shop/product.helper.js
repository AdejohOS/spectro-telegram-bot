import { getProductState } from "./product.state.js";

import { productConfirmationContent } from "./product.content.js";

import { productConfirmKeyboard } from "./product.keyboard.js";

export async function sendProductConfirmation(ctx) {
  const state = getProductState(ctx.from.id);

  return ctx.reply(productConfirmationContent(state), {
    parse_mode: "HTML",
    reply_markup: productConfirmKeyboard().reply_markup,
  });
}
