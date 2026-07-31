import { depositKeyboard } from "./deposit.keyboard.js";
import { UserRepository } from "../users/user.repository.js";
import {
  setDepositState,
  getDepositState,
  clearDepositState,
} from "./deposit.state.js";

export function registerDepositAction(bot) {
  bot.action("DEPOSIT", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText("Choose your preferred deposit network.", {
      reply_markup: depositKeyboard().reply_markup,
    });
  });
  bot.action("DEPOSIT_BTC", async (ctx) => {
    await ctx.answerCbQuery();

    setDepositState(ctx.from.id, {
      network: "BTC",
      step: "AMOUNT",
    });

    await ctx.reply(
      `Enter the amount you wish to deposit.

Minimum Deposit

$50`,
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  });
  bot.action("DEPOSIT_TRC20", async (ctx) => {
    await ctx.answerCbQuery();

    setDepositState(ctx.from.id, {
      network: "TRC20",
      step: "AMOUNT",
    });

    await ctx.reply(
      `Enter the amount you wish to deposit.

Minimum Deposit

$50`,
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  });
}
