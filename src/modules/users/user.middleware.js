import { UserService } from "./user.service.js";

export async function syncTelegramUser(ctx, next) {
  if (ctx.from) {
    try {
      await UserService.registerTelegramUser(ctx.from);
    } catch (error) {
      console.error("User sync failed:", error);
    }
  }

  return next();
}
