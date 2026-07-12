import { UserRepository } from "../../modules/users/user.repository.js";

export async function userMiddleware(ctx, next) {
  if (ctx.from) {
    ctx.state.user = await UserRepository.findByTelegramId(ctx.from.id);
  }

  return next();
}
