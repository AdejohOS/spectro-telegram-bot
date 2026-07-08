import { logger } from "../../utils/logger.js";

export function loggerMiddleware(ctx, next) {
  logger.info({
    userId: ctx.from?.id,
    username: ctx.from?.username,
    updateType: ctx.updateType,
    message: ctx.message?.text,
  });

  return next();
}
