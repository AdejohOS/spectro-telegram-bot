import { getProfile } from "./profile.service.js";
import { profileMessage } from "./profile.content.js";
import { backKeyboard } from "../../bot/keyboards/back.keyboard.js";

export function registerProfileHandler(bot) {
  bot.action("PROFILE", async (ctx) => {
    await ctx.answerCbQuery();

    const profile = await getProfile(ctx.from.id);

    if (!profile) {
      return ctx.reply("Profile not found.");
    }

    await ctx.editMessageText(profileMessage(profile), {
      parse_mode: "HTML",
      reply_markup: backKeyboard().reply_markup,
    });
  });
}
