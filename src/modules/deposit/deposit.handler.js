import { AddressService } from "../address/address.service.js";
import { UserRepository } from "../users/user.repository.js";
import { depositMessage } from "./deposit.content.js";
import { depositAddressKeyboard } from "./deposit.keyboard.js";
import { getDepositState, setDepositState } from "./deposit.state.js";

export function registerDepositHandler(bot) {
  bot.on("text", async (ctx, next) => {
    const state = getDepositState(ctx.from.id);

    if (!state) {
      return next();
    }

    if (state.step !== "AMOUNT") {
      return next();
    }

    const amount = Number(ctx.message.text);

    if (Number.isNaN(amount) || amount < 50) {
      return ctx.reply("❌ Minimum deposit is $50.");
    }

    const user = await UserRepository.findByTelegramId(ctx.from.id);

    let address;

    try {
      address = await AddressService.getOrAssignAddress(user.id, state.network);
    } catch (error) {
      if (error.message === "NO_AVAILABLE_ADDRESS") {
        return ctx.reply(
          "No deposit address is available for this network right now. Please contact support.",
        );
      }

      throw error;
    }

    setDepositState(ctx.from.id, {
      ...state,
      amount,
      address: address.address,
    });

    return ctx.reply(depositMessage(state.network, amount, address.address), {
      parse_mode: "Markdown",
      reply_markup: depositAddressKeyboard().reply_markup,
    });
  });
}
