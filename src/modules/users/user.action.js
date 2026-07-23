import { userDetailsContent } from "../lookup/lookup.content.js";
import { userDetailsKeyboard } from "./user.keyboard.js";
import { getAdminState } from "../admin/admin.state.js";
import { UserService } from "./user.service.js";

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
}
