import { supportContent } from "./support.content.js";
import { supportKeyboard } from "./support.keyboard.js";

import { AdminSettingsService } from "../admin/admin.settings.service.js";

export function registerSupportActions(bot) {
  bot.action("SUPPORT", async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const settings = await AdminSettingsService.getSupportSettings();

      const supportUsername = settings.username;

      const supportLink = `https://t.me/${supportUsername.replace(/^@/, "")}`;

      await ctx.editMessageText(supportContent(ctx.from.id, supportUsername), {
        parse_mode: "HTML",
        reply_markup: supportKeyboard(supportLink).reply_markup,
      });
    } catch (error) {
      console.error("Support settings error:", error);

      await ctx.reply(
        "Unable to load support details right now. Please try again.",
      );
    }
  });
}
