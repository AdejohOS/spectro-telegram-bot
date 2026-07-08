import { RULES_MESSAGE } from "../../content/rules.js";
import { backKeyboard } from "../../bot/keyboards/back.keyboard.js";

export function registerRulesAction(bot) {
  bot.action("RULES", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(RULES_MESSAGE, {
      parse_mode: "Markdown",
      reply_markup: backKeyboard().reply_markup,
    });
  });
}
