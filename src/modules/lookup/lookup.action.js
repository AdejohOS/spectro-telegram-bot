import { userLookupContent } from "./lookup.content.js";
import { userLookupKeyboard } from "./lookup.keyboard.js";
import { setAdminState } from "../admin/admin.state.js";

export function registerAdminLookupActions(bot) {
  bot.action("USER_LOOKUP", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(userLookupContent(), {
      parse_mode: "HTML",
      reply_markup: userLookupKeyboard().reply_markup,
    });
  });
  bot.action("LOOKUP_USERNAME", async (ctx) => {
    await ctx.answerCbQuery();

    setAdminState(ctx.from.id, {
      step: "LOOKUP_USERNAME",
    });

    await ctx.reply("Enter the username.\n\nExample:\n@username001", {
      reply_markup: {
        force_reply: true,
      },
    });
  });

  bot.action("LOOKUP_ADDRESS", async (ctx) => {
    await ctx.answerCbQuery();

    setAdminState(ctx.from.id, {
      step: "LOOKUP_ADDRESS",
    });

    await ctx.reply("Paste the wallet address.", {
      reply_markup: {
        force_reply: true,
      },
    });
  });
}
