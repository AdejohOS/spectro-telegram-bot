import { supportContent } from "./support.content.js";
import { supportKeyboard } from "./support.keyboard.js";

export function registerSupportActions(bot) {
  bot.action("SUPPORT", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(supportContent(ctx.from.id), {
      parse_mode: "HTML",
      reply_markup: supportKeyboard().reply_markup,
    });
  });
}
