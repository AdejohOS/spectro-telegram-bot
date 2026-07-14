import { UserService } from "./user.service.js";
import { mainKeyboard } from "../../bot/keyboards/main.keyboard.js";
import { welcomeMessage } from "../../content/welcome.js";
import { clearDepositState } from "../deposit/deposit.state.js";
import { clearEscrowState } from "../escrow/escrow.state.js";
import { clearDisputeState } from "../escrow/dispute.state.js";
import { clearProductState } from "../shop/product.state.js";
import { clearWithdrawalState } from "../withdrawal/withdrawal.state.js";
import { clearAdminState } from "../admin/admin.state.js";

export async function start(ctx) {
  const user = await UserService.registerTelegramUser(ctx.from);

  await ctx.reply(welcomeMessage(ctx.from.first_name), {
    parse_mode: "HTML",
    ...mainKeyboard(ctx.from.id),
  });
}

export async function menu(ctx) {
  const userId = ctx.from.id;

  clearDepositState(userId);
  clearEscrowState(userId);
  clearDisputeState(userId);
  clearProductState(userId);
  clearWithdrawalState(userId);
  clearAdminState(userId);

  await ctx.reply(welcomeMessage(ctx.from.first_name), {
    parse_mode: "HTML",
    ...mainKeyboard(userId),
  });
}
