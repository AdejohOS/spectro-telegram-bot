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

$20`,
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

$20`,
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  });

  bot.action("I_HAVE_DEPOSITED", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getDepositState(ctx.from.id);

    if (!state?.network || !state?.amount || !state?.address) {
      return ctx.reply("Deposit session expired. Please start again.");
    }

    // Notify admins...

    clearDepositState(ctx.from.id);

    await ctx.editMessageText(
      `✅ <b>Notification Sent</b>

Your administrators have been notified.

Your wallet will be credited after your transaction has been verified.`,
      {
        parse_mode: "HTML",
      },
    );
  });
}
