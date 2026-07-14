import { AddressService } from "../address/address.service.js";

import { depositAddressKeyboard, depositKeyboard } from "./deposit.keyboard.js";

import { depositMessage } from "./deposit.content.js";
import { UserRepository } from "../users/user.repository.js";
import { AddressRepository } from "../address/address.repository.js";
import {
  setDepositState,
  getDepositState,
  clearDepositState,
} from "./deposit.state.js";

import { Markup } from "telegraf";

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
          reply_markup: depositAddressKeyboard("BTC", address.address)
            .reply_markup,
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
          reply_markup: depositAddressKeyboard("TRC20", address.address)
            .reply_markup,
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

  bot.action(/^I_HAVE_DEPOSITED\|(.+)\|(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const network = ctx.match[1];
    const address = ctx.match[2];

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
  });
}
