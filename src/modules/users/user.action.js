import { userDetailsContent } from "../lookup/lookup.content.js";
import { userDetailsKeyboard } from "./user.keyboard.js";
import { getAdminState } from "../admin/admin.state.js";
import { UserService } from "./user.service.js";

import { WalletTransactionRepository } from "../wallet/wallet-transaction.repository.js";
import { userTransactionsContent } from "./user.content.js";
import { userTransactionsKeyboard } from "./user.keyboard.js";
import { UserRepository } from "./user.repository.js";

export function registerUserActions(bot) {
  bot.action("BAN_USER", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getAdminState(ctx.from.id);

    await UserService.banUser(state.user.id);

    state.user.status = "banned";

    await ctx.editMessageText(userDetailsContent(state.user), {
      parse_mode: "HTML",
      reply_markup: userDetailsKeyboard(state.user).reply_markup,
    });

    // try {
    //   await ctx.telegram.sendMessage(
    //   state.user.telegramId,
    //     `🚫 <b>Account Banned</b>

    // Your Spectro account has been banned.

    // If you believe this is an error, please contact Spectro Support.`,
    //        {
    //          parse_mode: "HTML",
    //   },
    //  );
    // } catch (err) {
    //    console.error(err);
    //  }
  });

  bot.action("UNBAN_USER", async (ctx) => {
    await ctx.answerCbQuery();

    const state = getAdminState(ctx.from.id);

    await UserService.unBanUser(state.user.id);

    state.user.status = "active";

    await ctx.editMessageText(userDetailsContent(state.user), {
      parse_mode: "HTML",
      reply_markup: userDetailsKeyboard(state.user).reply_markup,
    });

    // try {
    //     await ctx.telegram.sendMessage(
    //   state.user.telegramId,
    //     `✅ <b>Account Restored</b>

    // Your Spectro account has been restored.

    // You may now continue using Spectro.`,
    //     {
    //        parse_mode: "HTML",
    //      },
    //  );
    //  } catch (err) {
    //      console.error(err);
    //  }
  });

  bot.action(/^USER_TRANSACTIONS:(.+):(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const userId = ctx.match[1];
      const page = Number(ctx.match[2]);

      const user = await UserRepository.findById(userId);

      if (!user) {
        return ctx.reply("❌ User not found.");
      }

      const data = await WalletTransactionRepository.findByUserIdPaginated(
        userId,
        page,
        10,
      );

      const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

      await ctx.editMessageText(
        userTransactionsContent(
          user,
          data.transactions,
          data.page,
          data.total,
          data.limit,
        ),
        {
          parse_mode: "HTML",
          reply_markup: userTransactionsKeyboard(userId, data.page, totalPages)
            .reply_markup,
        },
      );
    } catch (error) {
      console.error("Transaction history error:", error);

      await ctx.reply("❌ Unable to load transaction history.");
    }
  });
  bot.action(/^BACK_TO_USER:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const userId = ctx.match[1];

      const profile = await UserRepository.findById(userId);

      if (!profile) {
        return ctx.reply("❌ User not found.");
      }

      await ctx.editMessageText(userDetailsContent(profile), {
        parse_mode: "HTML",
        reply_markup: userDetailsKeyboard(profile).reply_markup,
      });
    } catch (error) {
      console.error("Back to user error:", error);

      await ctx.reply("❌ Unable to load user profile.");
    }
  });
}
