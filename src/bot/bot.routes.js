import { registerStartCommand } from "../modules/users/start.command.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";

import { registerRulesAction } from "../modules/rules/rules.action.js";
import { registerNavigationAction } from "../modules/navigation/navigation.action.js";
import { registerProfileHandler } from "../handlers/registerProfileHandler.js";
import { registerDepositActions } from "../modules/deposit/deposit.actions.js";

export function registerRoutes(bot) {
  bot.use(loggerMiddleware);

  registerStartCommand(bot);

  registerRulesAction(bot);
  registerNavigationAction(bot);
  registerProfileHandler(bot);

  registerDepositActions(bot);

  // Commands
  // Actions

  // Middlewares
}
