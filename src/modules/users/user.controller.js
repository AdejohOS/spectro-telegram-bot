import { UserService } from "./user.service.js";
import { mainKeyboard } from "../../bot/keyboards/main.keyboard.js";
import { welcomeMessage } from "../../content/welcome.js";

export async function start(ctx) {
  const user = await UserService.registerTelegramUser(ctx.from);

  await ctx.reply(welcomeMessage(ctx.from.first_name), {
    parse_mode: "Markdown",
    ...mainKeyboard(),
  });
}
