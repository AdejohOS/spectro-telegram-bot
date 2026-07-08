import { welcomeMessage } from "../../content/welcome.js";
import { mainKeyboard } from "../../bot/keyboards/main.keyboard.js";

export function registerNavigationAction(bot) {
  bot.action("MAIN_MENU", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(welcomeMessage(ctx.from.first_name), {
      parse_mode: "Markdown",
      reply_markup: mainKeyboard().reply_markup,
    });
  });
}
