import { registerStartCommand } from "../modules/users/start.command.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";

import { registerRulesAction } from "../modules/rules/rules.action.js";
import { registerNavigationAction } from "../modules/navigation/navigation.action.js";
import { registerProfileHandler } from "../modules/profile/profile.action.js";
import { registerDepositAction } from "../modules/deposit/deposit.actions.js";
import { registerAdminHandler } from "../modules/admin/admin.handler.js";
import { registerAdminActions } from "../modules/admin/admin.action.js";
import { registerEscrowActions } from "../modules/escrow/escrow.actions.js";
import { registerEscrowHandler } from "../modules/escrow/escrow.handler.js";
import { registerWithdrawalActions } from "../modules/withdrawal/withdrawal.actions.js";
import { registerWithdrawalHandler } from "../modules/withdrawal/withdrawal.handler.js";

import { registerProductActions } from "../modules/shop/product.action.js";
import { registerProductHandler } from "../modules/shop/product.handler.js";
import { registerShopActions } from "../modules/shop/shop.action.js";

import { registerOrderActions } from "../modules/order/order.action.js";

export function registerRoutes(bot) {
  bot.use(loggerMiddleware);

  registerStartCommand(bot);

  registerRulesAction(bot);
  registerNavigationAction(bot);
  registerProfileHandler(bot);

  registerDepositAction(bot);

  registerAdminActions(bot);
  registerAdminHandler(bot);

  registerEscrowActions(bot);
  registerEscrowHandler(bot);

  registerWithdrawalActions(bot);
  registerWithdrawalHandler(bot);

  registerProductActions(bot);
  registerProductHandler(bot);

  registerShopActions(bot);

  registerOrderActions(bot);

  // Commands
  // Actions

  // Middlewares
}
