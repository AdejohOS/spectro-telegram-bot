import { AddressService } from "../address/address.service.js";

import { depositAddressKeyboard, depositKeyboard } from "./deposit.keyboard.js";

import { depositMessage } from "./deposit.content.js";
import { UserRepository } from "../users/user.repository.js";

export function registerDepositAction(bot) {
  bot.action("DEPOSIT", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText("Choose your preferred deposit network.", {
      reply_markup: depositKeyboard().reply_markup,
    });
  });
  bot.action("DEPOSIT_BTC", async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const user = await UserRepository.findByTelegramId(ctx.from.id);

      const address = await AddressService.getOrAssignAddress(user.id, "BTC");

      await ctx.editMessageText(
        depositMessage("Bitcoin (BTC)", address.address),
        {
          parse_mode: "Markdown",
          reply_markup: depositAddressKeyboard().reply_markup,
        },
      );
    } catch (error) {
      if (error.message === "NO_AVAILABLE_ADDRESS") {
        return ctx.editMessageText(
          "⚠️ There are currently no BTC deposit addresses available.\n\nPlease contact an administrator.",
          {
            reply_markup: depositKeyboard().reply_markup,
          },
        );
      }

      throw error;
    }
  });
  bot.action("DEPOSIT_TRC20", async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const user = await UserRepository.findByTelegramId(ctx.from.id);

      const address = await AddressService.getOrAssignAddress(user.id, "TRC20");

      await ctx.editMessageText(
        depositMessage("USDT (TRC20)", address.address),
        {
          parse_mode: "Markdown",
          reply_markup: depositAddressKeyboard().reply_markup,
        },
      );
    } catch (error) {
      if (error.message === "NO_AVAILABLE_ADDRESS") {
        return ctx.editMessageText(
          "⚠️ There are currently no TRC20 deposit addresses available.\n\nPlease contact an administrator.",
          {
            reply_markup: depositKeyboard().reply_markup,
          },
        );
      }

      throw error;
    }
  });
}
