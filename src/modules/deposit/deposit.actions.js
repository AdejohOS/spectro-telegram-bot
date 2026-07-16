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

  bot.action("I_HAVE_DEPOSITED", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getDepositState(ctx.from.id);

    if (!state?.network || !state?.amount || !state?.address) {
      return ctx.reply("Deposit session expired. Please start again.");
    }

    const { network, amount, address } = state;

    const user = await UserRepository.findByTelegramId(ctx.from.id);

    const admins = await UserRepository.findAdmins();

    for (const admin of admins) {
      await ctx.telegram.sendMessage(
        admin.telegramId,
        `💳 <b>Deposit Notification</b>

A user has reported making a deposit.

━━━━━━━━━━━━━━

👤 <b>User</b>

${user.firstName}

${user.username ? `@${user.username}` : "No Username"}

🌐 <b>Network</b>

${network}

<b>Amount</b>

$${amount}

🏦 <b>Deposit Address</b>

<code>${address}</code>

🟡 <b>Status</b>

Awaiting Blockchain Verification`,
        {
          parse_mode: "HTML",
        },
      );
    }

    await ctx.editMessageText(
      `✅ <b>Notification Sent</b>

Your administrators have been notified.

Your wallet will be credited after your transaction has been verified.`,
      {
        parse_mode: "HTML",
      },
    );

    clearDepositState(ctx.from.id);
  });
}
