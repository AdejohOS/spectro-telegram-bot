import { UserService } from "./user.service.js";
import { UserRepository } from "./user.repository.js";

export async function syncTelegramUser(ctx, next) {
  if (ctx.from) {
    try {
      await UserService.registerTelegramUser(ctx.from);

      const user = await UserRepository.findByTelegramId(ctx.from.id);

      //      if (user?.status === "suspended") {
      //        return ctx.reply(
      //          `⏸️ <b>Account Suspended</b>

      //Your account has been temporarily suspended.

      //Please contact Spectro Support for more information.`,
      //        {
      //         parse_mode: "HTML",
      //     },
      //      );
      //    }

      //     if (user?.status === "banned") {
      //       return ctx.reply(
      //         `🚫 <b>Account Blocked</b>

      //Your Spectro account has been banned.

      //Please contact Spectro Support if you believe this is an error.`,
      //         {
      //           parse_mode: "HTML",
      //         },
      //       );
      //     }

      if (user?.status === "banned") {
        return ctx.reply(`.`, {
          parse_mode: "HTML",
        });
      }
    } catch (error) {
      console.error("User sync failed:", error);
    }
  }

  return next();
}
