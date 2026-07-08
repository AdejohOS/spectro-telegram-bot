import { getOrAssignAddress } from "../../services/address.service.js";
import { depositKeyboard } from "./deposit.keyboard.js";
import { depositAddressMessage } from "../../content/depositAddress.js";
import { depositAddressKeyboard } from "./depositAddressKeyboard.js";

export function registerDepositActions(bot) {
  bot.action("DEPOSIT", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText("💰 Select a deposit network.", {
      reply_markup: depositKeyboard().reply_markup,
    });
  });

  bot.action(/^DEPOSIT:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const network = ctx.match[1];

    const address = await getOrAssignAddress(ctx.state.user.id, network);

    await ctx.editMessageText(depositAddressMessage(network, address.address), {
      parse_mode: "Markdown",
      reply_markup: depositAddressKeyboard(network, address.address)
        .reply_markup,
    });
  });
}
