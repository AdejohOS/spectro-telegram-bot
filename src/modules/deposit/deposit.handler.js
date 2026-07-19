import { AddressService } from "../address/address.service.js";
import { UserRepository } from "../users/user.repository.js";
import { depositMessage } from "./deposit.content.js";
import { depositAddressKeyboard } from "./deposit.keyboard.js";
import { getDepositState, setDepositState } from "./deposit.state.js";

export function registerDepositHandler(bot) {
  bot.on("text", async (ctx, next) => {
    const state = getDepositState(ctx.from.id);

    if (!state) {
      return next();
    }

    if (state.step !== "AMOUNT") {
      return next();
    }

    const amount = Number(ctx.message.text);

    if (Number.isNaN(amount) || amount < 50) {
      return ctx.reply("❌ Minimum deposit is $50.");
    }

    const user = await UserRepository.findByTelegramId(ctx.from.id);

    let address;

    try {
      address = await AddressService.getOrAssignAddress(user.id, state.network);
    } catch (error) {
      if (error.message === "NO_AVAILABLE_ADDRESS") {
        return ctx.reply(
          "No deposit address is available for this network right now. Please contact support.",
        );
      }

      throw error;
    }

    setDepositState(ctx.from.id, {
      ...state,
      amount,
      address: address.address,
    });

    const admins = await UserRepository.findAdmins();

    for (const admin of admins) {
      await ctx.telegram.sendMessage(
        admin.telegramId,
        `🆕 <b>New Deposit Request</b>

A user has initiated a deposit.

━━━━━━━━━━━━━━

👤 <b>User</b>

${user.firstName}

${user.username ? `@${user.username}` : "No Username"}

🌐 <b>Network</b>

${state.network}

💰 <b>Amount</b>

$${amount}

🏦 <b>Deposit Address</b>

<code>${address.address}</code>

🟡 <b>Status</b>

Waiting for blockchain payment.

The user has not yet confirmed payment.`,
        {
          parse_mode: "HTML",
        },
      );
    }

    return ctx.reply(depositMessage(state.network, amount, address.address), {
      parse_mode: "Markdown",
      reply_markup: depositAddressKeyboard().reply_markup,
    });
  });
}
