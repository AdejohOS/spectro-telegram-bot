import { sendEscrowConfirmation } from "./escrow.helpers.js";
import {
  getEscrowState,
  setEscrowState,
  clearEscrowState,
} from "./escrow.state.js";
import { UserRepository } from "../users/user.repository.js";
import { getDisputeState, clearDisputeState } from "./dispute.state.js";
import { EscrowService } from "./escrow.service.js";
import { viewEscrowKeyboard } from "./escrow.keyboard.js";
import { formatMoney } from "../../utils/money.js";
import { Markup } from "telegraf";

export function registerEscrowHandler(bot) {
  bot.on("text", async (ctx, next) => {
    const state = getEscrowState(ctx.from.id);

    if (state) {
      if (state.step === "SELLER") {
        const seller = await UserRepository.findByUsername(
          ctx.message.text.trim(),
        );

        if (!seller) {
          return ctx.reply("❌ Seller not found.");
        }

        if (seller.telegramId === ctx.from.id) {
          return ctx.reply("❌ You cannot create an escrow with yourself.");
        }

        setEscrowState(ctx.from.id, {
          step: "AMOUNT",
          seller,
        });

        return ctx.reply("Enter the escrow amount.", {
          reply_markup: {
            force_reply: true,
          },
        });
      }

      if (state.step === "AMOUNT") {
        const amount = Number(ctx.message.text);

        if (Number.isNaN(amount) || amount <= 0) {
          return ctx.reply("❌ Please enter a valid amount.");
        }

        setEscrowState(ctx.from.id, {
          ...state,
          step: "TITLE",
          amount,
        });

        return ctx.reply("Enter the escrow title.", {
          reply_markup: {
            force_reply: true,
          },
        });
      }
      if (state.step === "TITLE") {
        setEscrowState(ctx.from.id, {
          ...state,
          step: "DESCRIPTION",
          title: ctx.message.text.trim(),
        });

        return ctx.reply("Enter a description.", {
          reply_markup: {
            force_reply: true,
          },
        });
      }

      if (state.step === "DESCRIPTION") {
        setEscrowState(ctx.from.id, {
          ...state,
          step: "CONFIRM",
          description: ctx.message.text.trim(),
        });

        return sendEscrowConfirmation(ctx);
      }
    }

    const dispute = getDisputeState(ctx.from.id);

    if (dispute) {
      if (dispute.step === "REASON") {
        const escrow = await EscrowService.openDispute(
          dispute.escrowId,

          ctx.from.id,

          ctx.message.text,
        );

        const details = await EscrowService.getEscrow(escrow.id);
        if (details.sellerTelegramId !== ctx.from.id) {
          await ctx.telegram.sendMessage(
            details.sellerTelegramId,

            `⚖️ <b>Dispute Opened</b>

A dispute has been opened for this escrow.

Funds remain locked while the case is reviewed.`,

            {
              parse_mode: "HTML",
              reply_markup: viewEscrowKeyboard(details.id).reply_markup,
            },
          );
        }
        if (details.buyerTelegramId !== ctx.from.id) {
          await ctx.telegram.sendMessage(
            details.buyerTelegramId,

            `⚖️ <b>Dispute Opened</b>

The escrow is now under dispute.

An administrator will review the case.`,

            {
              parse_mode: "HTML",
              reply_markup: viewEscrowKeyboard(details.id).reply_markup,
            },
          );
        }
        const admins = await UserRepository.findAdmins();

        for (const admin of admins) {
          await ctx.telegram.sendMessage(
            admin.telegramId,
            `🚨 <b>New Escrow Dispute</b>

<code>${details.escrowNumber}</code>

Buyer:
@${details.buyerUsername}

Seller:
@${details.sellerUsername}

💰 $${formatMoney(details.amount)}

Reason:

${details.disputeReason}`,
            {
              parse_mode: "HTML",
              reply_markup: Markup.inlineKeyboard([
                [
                  Markup.button.callback(
                    "⚖️ Review Dispute",
                    `VIEW_ESCROW:${details.id}`,
                  ),
                ],
              ]).reply_markup,
            },
          );
        }

        clearDisputeState(ctx.from.id);

        return ctx.reply(
          `✅ Your dispute has been submitted.

Our administrators have been notified.

Funds remain securely locked until a decision is made.`,
        );
      }
    }

    return next();
  });
}
