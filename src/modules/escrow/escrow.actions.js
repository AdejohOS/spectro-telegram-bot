import {
  setEscrowState,
  getEscrowState,
  clearEscrowState,
} from "./escrow.state.js";
import { escrowKeyboard } from "./escrow.keyboard.js";
import { UserRepository } from "../users/user.repository.js";
import { EscrowService } from "./escrow.service.js";
import { formatMoney } from "../../utils/money.js";
import { pendingEscrowsContent } from "./escrow.content.js";
import { pendingEscrowsKeyboard } from "./escrow.keyboard.js";
import { escrowDetailsContent } from "./escrow.content.js";
import { escrowDetailsKeyboard } from "./escrow.keyboard.js";
import { viewEscrowKeyboard } from "./escrow.keyboard.js";
import { escrowListContent } from "./escrow.content.js";
import { escrowListKeyboard } from "./escrow.keyboard.js";
import { escrowHistoryKeyboard } from "./escrow.keyboard.js";
import { escrowHistoryContent } from "./escrow.content.js";
import { setDisputeState } from "./dispute.state.js";
import { Markup } from "telegraf";
import { isAdmin } from "../../config/admin.js";
import { ESCROW_STATUS } from "../../utils/references.js";
import { adminEscrowKeyboard } from "../admin/admin.dispute.keyboard.js";

export function registerEscrowActions(bot) {
  bot.action("ESCROW_PANEL", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText("🤝 *Escrow Menu*", {
      parse_mode: "Markdown",

      reply_markup: escrowKeyboard().reply_markup,
    });
  });
  bot.action("CREATE_ESCROW", async (ctx) => {
    await ctx.answerCbQuery();

    setEscrowState(ctx.from.id, {
      step: "SELLER",
    });

    console.log("SET ESCROW:", ctx.from.id, getEscrowState(ctx.from.id));

    await ctx.reply(
      "Enter the seller's username, including @. Example: @username001",
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  });

  bot.action("CONFIRM_ESCROW", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getEscrowState(ctx.from.id);

    try {
      const buyer = await UserRepository.findByTelegramId(ctx.from.id);

      const escrow = await EscrowService.create({
        buyerId: buyer.id,

        sellerId: state.seller.id,

        amount: state.amount,

        title: state.title,

        description: state.description,
      });

      clearEscrowState(ctx.from.id);

      await ctx.editMessageText(
        `✅ *Escrow Created Successfully*

Escrow Number:

\`${escrow.escrowNumber}\`

Status:

*${escrow.status.toUpperCase()}*

💰 Your funds have been securely locked.

Waiting for the seller to accept.`,
        {
          parse_mode: "Markdown",
        },
      );
      const details = await EscrowService.getEscrow(escrow.id);

      await ctx.telegram.sendMessage(
        details.sellerTelegramId,

        `<b>🤝 New Escrow Request</b>

A buyer has created a new escrow.

<b>Escrow</b>

<code>${details.escrowNumber}</code>

<b>Buyer</b>

@${details.buyerUsername}

<b>Amount</b>

💰 <b>$${formatMoney(details.amount)}</b>

<b>Item</b>

📦 ${details.title}

The buyer's funds have already been secured.

Please review the escrow before accepting.`,

        {
          parse_mode: "HTML",

          reply_markup: viewEscrowKeyboard(details.id).reply_markup,
        },
      );
    } catch (error) {
      console.error(error);

      await ctx.reply(error.message);
    }
  });

  bot.action("CANCEL_ESCROW", async (ctx) => {
    await ctx.answerCbQuery();

    clearEscrowState(ctx.from.id);

    await ctx.editMessageText("❌ Escrow creation cancelled.");
  });

  bot.action(/^CANCEL_PENDING_ESCROW:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const escrow = await EscrowService.cancelPending(
        ctx.match[1],
        ctx.from.id,
      );
      const details = await EscrowService.getEscrow(escrow.id);

      await ctx.editMessageText(
        `<b>Escrow Cancelled</b>

Your locked funds have been refunded to your wallet.`,
        {
          parse_mode: "HTML",
        },
      );

      await ctx.telegram.sendMessage(
        details.sellerTelegramId,
        `<b>Escrow Cancelled</b>

The buyer cancelled this escrow before acceptance.`,
        {
          parse_mode: "HTML",
          reply_markup: viewEscrowKeyboard(details.id).reply_markup,
        },
      );
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });

  bot.action(/^ACCEPT_ESCROW:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const escrowId = ctx.match[1];

      const seller = await UserRepository.findByTelegramId(ctx.from.id);

      const escrow = await EscrowService.acceptEscrow(escrowId, seller.id);

      await ctx.editMessageText(escrowDetailsContent(details), {
        parse_mode: "HTML",
        reply_markup: escrowDetailsKeyboard(details, ctx.from.id).reply_markup,
      });

      const details = await EscrowService.getEscrow(escrow.id);

      await ctx.telegram.sendMessage(
        details.buyerTelegramId,

        `<b>✅ Escrow Accepted</b>

The seller has accepted your escrow.

Funds are locked and the escrow is now active.`,

        {
          parse_mode: "HTML",

          reply_markup: viewEscrowKeyboard(details.id).reply_markup,
        },
      );
    } catch (error) {
      console.error(error);

      await ctx.reply(error.message);
    }
  });
  bot.action(/^REJECT_ESCROW:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const seller = await UserRepository.findByTelegramId(ctx.from.id);

      const escrow = await EscrowService.reject(ctx.match[1], seller.id);

      const details = await EscrowService.getEscrow(escrow.id);

      await ctx.editMessageText(escrowDetailsContent(details), {
        parse_mode: "HTML",
        reply_markup: escrowDetailsKeyboard(details, ctx.from.id).reply_markup,
      });

      await ctx.telegram.sendMessage(
        details.buyerTelegramId,
        `<b>❌ Escrow Rejected</b>

The seller declined this escrow request.

Your locked funds have been refunded to your wallet.`,
        {
          parse_mode: "HTML",
          reply_markup: viewEscrowKeyboard(details.id).reply_markup,
        },
      );
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
  bot.action("ESCROW_PENDING", async (ctx) => {
    await ctx.answerCbQuery();

    const escrows = await EscrowService.getPending(ctx.from.id);

    await ctx.editMessageText(pendingEscrowsContent(escrows), {
      parse_mode: "HTML",

      reply_markup: pendingEscrowsKeyboard(escrows).reply_markup,
    });
  });

  bot.action(/^VIEW_ESCROW:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const escrowId = ctx.match[1];

    const escrow = await EscrowService.getEscrow(escrowId);

    if (!escrow) {
      return ctx.reply("Escrow not found.");
    }

    let keyboard;

    if (isAdmin(ctx.from.id) && escrow.status === ESCROW_STATUS.DISPUTED) {
      keyboard = adminEscrowKeyboard(escrow);
    } else {
      keyboard = escrowDetailsKeyboard(escrow, ctx.from.id);
    }

    await ctx.editMessageText(escrowDetailsContent(escrow), {
      parse_mode: "HTML",
      reply_markup: keyboard.reply_markup,
    });
  });

  bot.action(
    /^DELIVER_ESCROW:(.+)$/,

    async (ctx) => {
      await ctx.answerCbQuery();

      try {
        const escrow = await EscrowService.deliver(ctx.match[1], ctx.from.id);

        const details = await EscrowService.getEscrow(escrow.id);

        await ctx.telegram.sendMessage(
          details.buyerTelegramId,

          `<b>📦 Item Delivered</b>

The seller has marked the item as delivered.

Please inspect it carefully before releasing payment.`,

          {
            parse_mode: "HTML",

            reply_markup: viewEscrowKeyboard(details.id).reply_markup,
          },
        );

        await ctx.editMessageText(escrowDetailsContent(details), {
          parse_mode: "HTML",
          reply_markup: escrowDetailsKeyboard(details, ctx.from.id)
            .reply_markup,
        });
      } catch (error) {
        console.error(error);

        await ctx.reply(error.message);
      }
    },
  );
  bot.action(/^RELEASE_ESCROW:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const escrow = await EscrowService.release(ctx.match[1], ctx.from.id);

      await ctx.editMessageText(
        `🎉 <b>Payment Released</b>

The seller has been paid successfully.

Escrow completed.`,
        {
          parse_mode: "HTML",
        },
      );

      const details = await EscrowService.getEscrow(escrow.id);

      await ctx.telegram.sendMessage(
        details.sellerTelegramId,

        `<b>🎉 Payment Released</b>

The buyer has released the escrow.

💰 <b>${formatMoney(details.amount)}</b>

The funds have been credited to your wallet.

Thank you for using Spectro.`,

        {
          parse_mode: "HTML",

          reply_markup: Markup.inlineKeyboard([
            [
              Markup.button.callback(
                "📜 Completed Escrows",
                "ESCROW_COMPLETED",
              ),
            ],
          ]).reply_markup,
        },
      );
    } catch (error) {
      console.error(error);

      await ctx.reply(error.message);
    }
  });

  bot.action(/^ESCROW_LIST:(.+):(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const status = ctx.match[1];

    const page = Number(ctx.match[2]);

    const data = await EscrowService.listByStatus(ctx.from.id, status, page);

    const totalPages = Math.ceil(data.total / data.limit);

    await ctx.editMessageText(
      escrowListContent(
        status,
        data.escrows,
        data.page,
        data.total,
        data.limit,
      ),
      {
        parse_mode: "HTML",

        reply_markup: escrowListKeyboard(
          status,
          data.page,
          totalPages,
          data.escrows,
        ).reply_markup,
      },
    );
  });
  bot.action(/^ESCROW_ACTIVE:(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const page = Number(ctx.match[1]);

    const data = await EscrowService.getActive(ctx.from.id, page);

    const totalPages = Math.ceil(data.total / data.limit);

    await ctx.editMessageText(
      escrowListContent(
        "🔒 Active Escrows",
        data.escrows,
        data.page,
        data.total,
        data.limit,
      ),
      {
        parse_mode: "HTML",
        reply_markup: escrowListKeyboard(
          "active",
          data.page,
          totalPages,
          data.escrows,
        ).reply_markup,
      },
    );
  });
  bot.action(
    "ESCROW_HISTORY",

    async (ctx) => {
      await ctx.answerCbQuery();

      const summary = await EscrowService.getHistorySummary(ctx.from.id);

      await ctx.editMessageText(
        escrowHistoryContent(summary),

        {
          parse_mode: "HTML",

          reply_markup: escrowHistoryKeyboard().reply_markup,
        },
      );
    },
  );

  bot.action(/^DISPUTE_ESCROW:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    setDisputeState(ctx.from.id, {
      escrowId: ctx.match[1],
      step: "REASON",
    });

    await ctx.reply(
      `⚖️ <b>Open Dispute</b>

Tell us why you are opening this dispute.

Examples:

• Seller accepted but has not delivered

• Item not delivered

• Wrong item received

• Item damaged

• Buyer/Seller is not following the agreement`,
      {
        parse_mode: "HTML",
        reply_markup: {
          force_reply: true,
        },
      },
    );
  });

  bot.action(/^ADMIN_RELEASE_ESCROW:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const details = await EscrowService.adminRelease(
        ctx.match[1],
        ctx.from.id,
      );

      await ctx.editMessageText(
        `✅ <b>Dispute Resolved</b>

Funds have been released to the seller.`,
        {
          parse_mode: "HTML",
        },
      );

      // Notify Buyer
      await ctx.telegram.sendMessage(
        details.buyerTelegramId,
        `✅ <b>Dispute Resolved</b>

The dispute has been reviewed.

The funds have been released to the seller.`,
        {
          parse_mode: "HTML",
          reply_markup: viewEscrowKeyboard(details.id).reply_markup,
        },
      );

      // Notify Seller
      await ctx.telegram.sendMessage(
        details.sellerTelegramId,
        `🎉 <b>Dispute Resolved</b>

The administrator ruled in your favour.

The escrow funds have been credited to your wallet.`,
        {
          parse_mode: "HTML",
          reply_markup: viewEscrowKeyboard(details.id).reply_markup,
        },
      );
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
  bot.action(/^ADMIN_REFUND_ESCROW:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const details = await EscrowService.adminRefund(
        ctx.match[1],
        ctx.from.id,
      );

      await ctx.editMessageText(
        `↩ <b>Dispute Resolved</b>

The buyer has been refunded.`,
        {
          parse_mode: "HTML",
        },
      );

      // Notify Buyer
      await ctx.telegram.sendMessage(
        details.buyerTelegramId,
        `🎉 <b>Dispute Resolved</b>

The administrator ruled in your favour.

Your escrow funds have been refunded to your wallet.`,
        {
          parse_mode: "HTML",
          reply_markup: viewEscrowKeyboard(details.id).reply_markup,
        },
      );

      // Notify Seller
      await ctx.telegram.sendMessage(
        details.sellerTelegramId,
        `⚖️ <b>Dispute Resolved</b>

The administrator ruled in favour of the buyer.

The escrow has been refunded.`,
        {
          parse_mode: "HTML",
          reply_markup: viewEscrowKeyboard(details.id).reply_markup,
        },
      );
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
}
