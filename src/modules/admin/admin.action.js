import { isAdmin } from "../../config/admin.js";

import { adminKeyboard, searchUserKeyboard } from "./admin.keyboard.js";
import { formatMoney } from "../../utils/money.js";

import {
  getAdminState,
  setAdminState,
  clearAdminState,
} from "./admin.state.js";
import { AdminService } from "./admin.service.js";

import { creditConfirmation } from "./admin.content.js";
import { confirmCreditKeyboard } from "./admin.keyboard.js";
import { skipKeyboard } from "./admin.keyboard.js";
import { sendConfirmation } from "./admin.helpers.js";
import { adminDisputeKeyboard } from "./admin.dispute.keyboard.js";
import { pendingDisputesKeyboard } from "./admin.dispute.keyboard.js";

import {
  pendingDisputesContent,
  adminDisputeContent,
} from "./admin.dispute.content.js";
import { EscrowService } from "../escrow/escrow.service.js";
import { adminWithdrawalMenuKeyboard } from "./admin.withdrawal.keyboard.js";
import { WithdrawalService } from "../withdrawal/withdrawal.service.js";
import { withdrawalListContent } from "./admin.content.js";
import { withdrawalListKeyboard } from "./admin.withdrawal.keyboard.js";
import { adminWithdrawalDetailsContent } from "./admin.content.js";
import { adminWithdrawalDetailsKeyboard } from "./admin.withdrawal.keyboard.js";

import { adminProductMenuKeyboard } from "./admin.product.keyboard.js";
import { ProductService } from "../shop/product.service.js";
import { productListContent } from "../shop/product.content.js";
import { productListKeyboard } from "../shop/product.keyboard.js";
import { productDetailsKeyboard } from "../shop/product.keyboard.js";

import { adminStatisticsKeyboard } from "./admin.keyboard.js";
import { statisticsContent } from "./admin.content.js";

export function registerAdminActions(bot) {
  bot.action("ADMIN_PANEL", async (ctx) => {
    await ctx.answerCbQuery();

    if (!isAdmin(ctx.from.id)) {
      return ctx.answerCbQuery("❌ Unauthorized", {
        show_alert: true,
      });
    }

    await ctx.editMessageText("🛠 *Admin Panel*", {
      parse_mode: "Markdown",

      reply_markup: adminKeyboard().reply_markup,
    });
  });
  bot.action("ADMIN_STATS", async (ctx) => {
    await ctx.answerCbQuery();

    const stats = await AdminService.getStatistics();

    await ctx.editMessageText(statisticsContent(stats), {
      parse_mode: "HTML",
      reply_markup: adminStatisticsKeyboard().reply_markup,
    });
  });

  bot.action("ADMIN_CREDIT", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText("How would you like to find the user?", {
      reply_markup: searchUserKeyboard().reply_markup,
    });
  });
  bot.action("SEARCH_USERNAME", async (ctx) => {
    await ctx.answerCbQuery();

    setAdminState(ctx.from.id, {
      step: "SEARCH_USERNAME",
      startedAt: Date.now(),
    });

    await ctx.reply(
      "Enter the user's username, including @. Example: @username001",
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  });

  bot.action("SEARCH_ADDRESS", async (ctx) => {
    await ctx.answerCbQuery();

    setAdminState(ctx.from.id, {
      step: "SEARCH_ADDRESS",
    });

    await ctx.reply("Paste the user's BTC or TRC20 deposit address.", {
      reply_markup: {
        force_reply: true,
      },
    });
  });

  bot.action("NETWORK_BTC", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getAdminState(ctx.from.id);

    setAdminState(ctx.from.id, {
      ...state,
      step: "ENTER_TX_HASH",
      network: "BTC",
    });

    await ctx.reply(
      "Enter the transaction hash.\n\nOr tap Skip if you don't have one.",
      {
        reply_markup: skipKeyboard("SKIP_TX").reply_markup,
      },
    );
  });
  bot.action("NETWORK_TRC20", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getAdminState(ctx.from.id);

    setAdminState(ctx.from.id, {
      ...state,
      step: "ENTER_TX_HASH",
      network: "TRC20",
    });

    await ctx.reply(
      "Enter the transaction hash.\n\nOr tap Skip if you don't have one.",
      {
        reply_markup: skipKeyboard("SKIP_TX").reply_markup,
      },
    );
  });

  bot.action("SKIP_TX", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getAdminState(ctx.from.id);

    setAdminState(ctx.from.id, {
      ...state,
      step: "ENTER_NOTES",
      txHash: null,
    });

    await ctx.reply("Enter notes for this credit.\n\nOr tap Skip.", {
      reply_markup: skipKeyboard("SKIP_NOTE").reply_markup,
    });
  });

  bot.action("SKIP_NOTE", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getAdminState(ctx.from.id);

    setAdminState(ctx.from.id, {
      ...state,
      step: "CONFIRM",
      notes: null,
    });

    return sendConfirmation(ctx);
  });

  bot.action("CONFIRM_CREDIT", async (ctx) => {
    console.log("1. Confirm clicked");

    await ctx.answerCbQuery();

    console.log("2. Callback answered");

    const state = getAdminState(ctx.from.id);

    console.log("3. State:", state);

    try {
      const wallet = await AdminService.creditWallet(state, ctx.from.id);

      console.log("4. Wallet credited:", wallet);

      clearAdminState(ctx.from.id);

      await ctx.editMessageText(
        `✅ <b>Wallet Credited Successfully</b>

👤 <b>User:</b> ${
          state.user.username ? `@${state.user.username}` : state.user.firstName
        }

💰 <b>Amount:</b> <b>$${formatMoney(state.amount)}</b>

💳 <b>New Balance:</b> <b>$${formatMoney(wallet.availableBalance)}</b>

📩 The user has been notified.`,
        {
          parse_mode: "HTML",
        },
      );

      try {
        await ctx.telegram.sendMessage(
          state.user.telegramId,
          `🎉 <b>Wallet Credited</b>

Your wallet has been credited successfully.

💰 <b>Amount:</b> <b>$${formatMoney(state.amount)}</b>

💳 <b>New Balance:</b> <b>$${formatMoney(wallet.availableBalance)}</b>

📝 <b>Note:</b> ${state.notes ?? "No additional notes."}

Thank you for using Spectro.`,
          {
            parse_mode: "HTML",
          },
        );
      } catch (err) {
        console.error("Failed to notify user:", err);
      }

      console.log("5. Done");
    } catch (error) {
      console.error("ERROR:", error);
      await ctx.reply(error.message);
    }
  });

  bot.action("CANCEL_CREDIT", async (ctx) => {
    await ctx.answerCbQuery();

    clearAdminState(ctx.from.id);

    await ctx.editMessageText("Wallet credit cancelled.");
  });

  bot.action(
    "ADMIN_DISPUTES",

    async (ctx) => {
      await ctx.answerCbQuery();

      await ctx.editMessageText(
        adminDisputeContent(),

        {
          parse_mode: "HTML",

          reply_markup: adminDisputeKeyboard().reply_markup,
        },
      );
    },
  );
  bot.action(
    /^ADMIN_PENDING_DISPUTES:(\d+)$/,

    async (ctx) => {
      await ctx.answerCbQuery();

      const page = Number(ctx.match[1]);

      const data = await EscrowService.getPendingDisputes(page);

      await ctx.editMessageText(
        pendingDisputesContent(data),

        {
          parse_mode: "HTML",

          reply_markup: pendingDisputesKeyboard(
            data.escrows,

            data.page,

            Math.ceil(data.total / data.limit),
          ).reply_markup,
        },
      );
    },
  );

  bot.action(
    "ADMIN_WITHDRAWALS",

    async (ctx) => {
      await ctx.answerCbQuery();

      await ctx.editMessageText(
        `💸 <b>Withdrawal Center</b>

Choose a category.`,

        {
          parse_mode: "HTML",

          reply_markup: adminWithdrawalMenuKeyboard().reply_markup,
        },
      );
    },
  );
  bot.action(/^ADMIN_WITHDRAWAL_LIST:(.+):(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const status = ctx.match[1];
    const page = Number(ctx.match[2]);

    const result = await WithdrawalService.listByStatus(status, page);

    const totalPages = Math.max(1, Math.ceil(result.total / result.limit));

    await ctx.editMessageText(
      withdrawalListContent(
        status.toUpperCase(),
        result.withdrawals,
        page,
        totalPages,
      ),
      {
        parse_mode: "HTML",
        reply_markup: withdrawalListKeyboard(
          status,
          page,
          totalPages,
          result.withdrawals,
        ).reply_markup,
      },
    );
  });
  bot.action(
    /^ADMIN_VIEW_WITHDRAWAL:(.+)$/,

    async (ctx) => {
      await ctx.answerCbQuery();

      const withdrawal = await WithdrawalService.getWithdrawal(ctx.match[1]);

      if (!withdrawal) {
        return ctx.reply("Withdrawal not found.");
      }

      await ctx.editMessageText(adminWithdrawalDetailsContent(withdrawal), {
        parse_mode: "HTML",

        reply_markup: adminWithdrawalDetailsKeyboard(withdrawal).reply_markup,
      });
    },
  );
  bot.action(/^ADMIN_APPROVE_WITHDRAWAL:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const withdrawal = await WithdrawalService.approve(
        ctx.match[1],
        ctx.from.id,
      );

      const details = await WithdrawalService.getWithdrawal(withdrawal.id);

      await ctx.editMessageText("✅ <b>Withdrawal Approved</b>", {
        parse_mode: "HTML",
      });

      await ctx.telegram.sendMessage(
        details.telegramId,
        `<b>🎉 Withdrawal Approved</b>

Reference

<code>${details.reference}</code>

💰 ${details.amount} USDT

Your withdrawal has been approved and processed successfully.`,
        {
          parse_mode: "HTML",
        },
      );
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
  bot.action(/^ADMIN_REJECT_WITHDRAWAL:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const withdrawal = await WithdrawalService.reject(
        ctx.match[1],
        ctx.from.id,
      );

      const details = await WithdrawalService.getWithdrawal(withdrawal.id);

      await ctx.editMessageText(
        "❌ <b>Withdrawal Rejected</b>\n\nFunds have been returned to the user's wallet.",
        {
          parse_mode: "HTML",
        },
      );

      await ctx.telegram.sendMessage(
        details.telegramId,
        `<b>❌ Withdrawal Rejected</b>

Reference

<code>${details.reference}</code>

The withdrawal request was rejected.

The funds have been returned to your available balance.`,
        {
          parse_mode: "HTML",
        },
      );
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });

  bot.action(
    "ADMIN_PRODUCTS",

    async (ctx) => {
      await ctx.answerCbQuery();

      await ctx.editMessageText(
        `📦 <b>Shop Manager</b>

Choose an option.`,

        {
          parse_mode: "HTML",

          reply_markup: adminProductMenuKeyboard().reply_markup,
        },
      );
    },
  );
  bot.action(/^ADMIN_PRODUCT_LIST:(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const page = Number(ctx.match[1]);

    const result = await ProductService.adminList(page);

    const totalPages = Math.max(1, Math.ceil(result.total / result.limit));

    await ctx.editMessageText(
      productListContent(result.products, page, totalPages),
      {
        parse_mode: "HTML",
        reply_markup: productListKeyboard(page, totalPages, result.products)
          .reply_markup,
      },
    );
  });
}
