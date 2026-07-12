import { UserRepository } from "../users/user.repository.js";
import { AddressService } from "../wallet/address.service.js";
import { getWithdrawalState, setWithdrawalState } from "./withdrawal.state.js";
import { withdrawalConfirmKeyboard } from "./withdrawal.keyboard.js";
import { withdrawalConfirmationContent } from "./withdrawal.content.js";
import { withdrawalNetworkKeyboard } from "./withdrawal.keyboard.js";

export function registerWithdrawalHandler(bot) {
  bot.on("text", async (ctx, next) => {
    const state = getWithdrawalState(ctx.from.id);

    if (!state) {
      return next();
    }

    if (state.step === "AMOUNT") {
      const amount = Number(ctx.message.text);

      if (Number.isNaN(amount) || amount <= 0) {
        return ctx.reply("Invalid amount.");
      }

      setWithdrawalState(ctx.from.id, {
        step: "NETWORK",

        amount,
      });

      return ctx.reply("Select a network.", {
        ...withdrawalNetworkKeyboard(),
      });
    }

    if (state.step === "ADDRESS") {
      const user = await UserRepository.findByTelegramId(ctx.from.id);

      const address = ctx.message.text.trim();

      await AddressService.save(user.id, state.network, address);

      setWithdrawalState(ctx.from.id, {
        ...state,

        address,

        step: "CONFIRM",
      });

      return ctx.reply(
        withdrawalConfirmationContent({
          ...state,

          address,
        }),
        {
          parse_mode: "HTML",

          ...withdrawalConfirmKeyboard(),
        },
      );
    }

    return next();
  });
}
