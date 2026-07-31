import { UserService } from "./user.service.js";
import { mainKeyboard } from "../../bot/keyboards/main.keyboard.js";
import { welcomeMessage } from "../../content/welcome.js";
import { clearDepositState } from "../deposit/deposit.state.js";
import { clearEscrowState } from "../escrow/escrow.state.js";
import { clearDisputeState } from "../escrow/dispute.state.js";
import { clearProductState } from "../shop/product.state.js";
import { clearWithdrawalState } from "../withdrawal/withdrawal.state.js";
import { clearAdminState } from "../admin/admin.state.js";
import { clearAllStates } from "./user.utils.js";

export async function start(ctx) {
  const userId = ctx.from.id;
  await UserService.registerTelegramUser(ctx.from);

  clearAllStates(userId);

  await ctx.reply(welcomeMessage(ctx.from.first_name), {
    parse_mode: "HTML",
    ...mainKeyboard(ctx.from.id),
  });
}

export async function menu(ctx) {
  const userId = ctx.from.id;

  clearAllStates(userId);

  await ctx.reply(welcomeMessage(ctx.from.first_name), {
    parse_mode: "HTML",
    ...mainKeyboard(userId),
  });
}
