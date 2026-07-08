import { getProfile } from "../services/profile.service.js";
import { profileMessage } from "../content/profile.js";
import { backKeyboard } from "../bot/keyboards/back.keyboard.js";

export function registerProfileHandler(bot) {
  bot.action("PROFILE", async (ctx) => {
    await ctx.answerCbQuery();

    const profile = await getProfile(ctx.from.id);

    if (!profile) {
      return ctx.reply("Profile not found.");
    }

    await ctx.editMessageText(profileMessage(profile), {
      parse_mode: "Markdown",
      reply_markup: backKeyboard().reply_markup,
    });
  });
}
