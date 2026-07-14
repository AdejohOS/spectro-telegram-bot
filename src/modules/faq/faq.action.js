import { helpKeyboard } from "./faq.keyboard.js";
import {
  helpContent,
  depositsFAQ,
  withdrawalsFAQ,
  escrowFAQ,
  securityFAQ,
  shopFAQ,
} from "./faq.content.js";

export function registerFAQActions(bot) {
  bot.action("FAQ", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(helpContent(), {
      parse_mode: "HTML",
      reply_markup: helpKeyboard().reply_markup,
    });
  });

  bot.action("FAQ_DEPOSITS", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(depositsFAQ(), {
      parse_mode: "HTML",
      reply_markup: helpKeyboard().reply_markup,
    });
  });

  bot.action("FAQ_WITHDRAWALS", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(withdrawalsFAQ(), {
      parse_mode: "HTML",
      reply_markup: helpKeyboard().reply_markup,
    });
  });

  bot.action("FAQ_ESCROW", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(escrowFAQ(), {
      parse_mode: "HTML",
      reply_markup: helpKeyboard().reply_markup,
    });
  });

  bot.action("FAQ_SHOP", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(shopFAQ(), {
      parse_mode: "HTML",
      reply_markup: helpKeyboard().reply_markup,
    });
  });

  bot.action("FAQ_SECURITY", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(securityFAQ(), {
      parse_mode: "HTML",
      reply_markup: helpKeyboard().reply_markup,
    });
  });
}
