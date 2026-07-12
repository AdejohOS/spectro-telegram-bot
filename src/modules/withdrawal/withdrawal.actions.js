import { Markup } from "telegraf";
import { withdrawalNetworkKeyboard } from "./withdrawal.keyboard.js";
import {
  getWithdrawalState,
  setWithdrawalState,
  clearWithdrawalState,
} from "./withdrawal.state.js";
import { UserRepository } from "../users/user.repository.js";
import { AddressService } from "../wallet/address.service.js";
import {
  withdrawalConfirmationContent,
  withdrawalMenuContent,
} from "./withdrawal.content.js";
import { withdrawalConfirmKeyboard } from "./withdrawal.keyboard.js";
import { withdrawalMenuKeyboard } from "./withdrawal.keyboard.js";
import { WalletRepository } from "../wallet/wallet.repository.js";
import { WithdrawalService } from "./withdrawal.service.js";

export function registerWithdrawalActions(bot) {
  bot.action("WITHDRAWAL_MENU", async (ctx) => {
    await ctx.answerCbQuery();

    const user = await UserRepository.findByTelegramId(ctx.from.id);

    const wallet = await WalletRepository.findByUserId(user.id);

    await ctx.editMessageText(withdrawalMenuContent(wallet), {
      parse_mode: "HTML",

      reply_markup: withdrawalMenuKeyboard().reply_markup,
    });
  });
  bot.action(
    "WITHDRAW",

    async (ctx) => {
      await ctx.answerCbQuery();

      setWithdrawalState(ctx.from.id, {
        step: "AMOUNT",
      });

      await ctx.reply(
        "💸 Enter withdrawal amount.",

        {
          reply_markup: {
            force_reply: true,
          },
        },
      );
    },
  );
  bot.action(/^WITHDRAW_NETWORK:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const state = getWithdrawalState(ctx.from.id);

    const user = await UserRepository.findByTelegramId(ctx.from.id);

    const network = ctx.match[1];

    const saved = await AddressService.get(user.id, network);

    if (saved) {
      setWithdrawalState(ctx.from.id, {
        ...state,
        network,
        address: saved.address,
        step: "CONFIRM",
      });

      return ctx.reply(
        withdrawalConfirmationContent({
          ...state,
          network,
          address: saved.address,
        }),
        {
          parse_mode: "HTML",
          reply_markup: withdrawalConfirmKeyboard().reply_markup,
        },
      );
    }

    setWithdrawalState(ctx.from.id, {
      ...state,
      network,
      step: "ADDRESS",
    });

    return ctx.reply(`Enter your ${network} wallet address.`, {
      reply_markup: {
        force_reply: true,
      },
    });
  });

  bot.action(
    "CHANGE_WITHDRAW_ADDRESS",

    async (ctx) => {
      await ctx.answerCbQuery();

      const state = getWithdrawalState(ctx.from.id);

      setWithdrawalState(ctx.from.id, {
        ...state,

        step: "ADDRESS",
      });

      await ctx.reply(`Enter your ${state.network} wallet address.`, {
        reply_markup: {
          force_reply: true,
        },
      });
    },
  );
  bot.action(
    "WITHDRAW_CONFIRM",

    async (ctx) => {
      await ctx.answerCbQuery();

      const state = getWithdrawalState(ctx.from.id);

      try {
        const withdrawal = await WithdrawalService.create(
          ctx.from.id,

          state,
        );

        const user = await UserRepository.findByTelegramId(ctx.from.id);

        const admins = await UserRepository.findAdmins();

        for (const admin of admins) {
          await ctx.telegram.sendMessage(
            admin.telegramId,

            `<b>💸 New Withdrawal Request</b>

<b>Reference</b>
<code>${withdrawal.reference}</code>

<b>User</b>
@${user.username || "N/A"}

<b>Name</b>
${user.firstName}

<b>Amount</b>
💰 ${withdrawal.amount} USDT

<b>Network</b>
${withdrawal.network}

<b>Wallet Address</b>
<code>${withdrawal.address}</code>

<b>Status</b>
🟡 Pending Approval`,

            {
              parse_mode: "HTML",

              reply_markup: Markup.inlineKeyboard([
                [
                  Markup.button.callback(
                    "👁 Review Withdrawal",
                    `ADMIN_VIEW_WITHDRAWAL:${withdrawal.id}`,
                  ),
                ],
              ]).reply_markup,
            },
          );
        }

        clearWithdrawalState(ctx.from.id);

        await ctx.editMessageText(
          `✅ <b>Withdrawal Submitted</b>

Reference

<code>${withdrawal.reference}</code>

Status

🟡 Pending Approval

Your request has been submitted for review.`,

          {
            parse_mode: "HTML",
          },
        );
      } catch (error) {
        console.error(error);

        await ctx.reply(error.message);
      }
    },
  );
  bot.action("CANCEL_WITHDRAWAL", async (ctx) => {
    await ctx.answerCbQuery();

    clearWithdrawalState(ctx.from.id);

    const user = await UserRepository.findByTelegramId(ctx.from.id);

    const wallet = await WalletRepository.findByUserId(user.id);

    await ctx.editMessageText(withdrawalMenuContent(wallet), {
      parse_mode: "HTML",
      reply_markup: withdrawalMenuKeyboard().reply_markup,
    });
  });
}
