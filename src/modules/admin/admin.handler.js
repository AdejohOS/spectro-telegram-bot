import { getAdminState } from "./admin.state.js";
import { isAdmin } from "../../config/admin.js";
import { AdminService } from "./admin.service.js";
import { setAdminState } from "./admin.state.js";

import { networkKeyboard } from "./admin.keyboard.js";
import { skipKeyboard } from "./admin.keyboard.js";
import { toMinorUnits } from "../../utils/money.js";

export function registerAdminHandler(bot) {
  bot.on("text", async (ctx, next) => {
    if (!isAdmin(ctx.from.id)) {
      return next();
    }

    const state = getAdminState(ctx.from.id);

    if (!state) {
      return next();
    }

    if (state.step === "SEARCH_USERNAME") {
      const user = await AdminService.findUser(
        "username",
        ctx.message.text.trim(),
      );

      if (!user) {
        return ctx.reply("❌ User not found.");
      }

      setAdminState(ctx.from.id, {
        step: "ENTER_AMOUNT",

        user: {
          id: user.id,
          firstName: user.firstName,
          username: user.username,
          telegramId: user.telegramId,
        },
      });

      return ctx.reply(
        `✅ User Found

${user.firstName}
@${user.username ?? "No Username"}

Enter the amount to credit.`,
        {
          reply_markup: {
            force_reply: true,
          },
        },
      );
    }

    if (state.step === "SEARCH_ADDRESS") {
      const user = await AdminService.findUser(
        "address",
        ctx.message.text.trim(),
      );

      if (!user) {
        return ctx.reply("❌ Address not found.");
      }

      setAdminState(ctx.from.id, {
        step: "ENTER_AMOUNT",

        user: {
          id: user.id,
          firstName: user.firstName,
          username: user.username,
          telegramId: user.telegramId,
        },
      });

      return ctx.reply(
        `✅ User Found

${user.firstName}
@${user.username ?? "No Username"}

Enter the amount to credit.`,
        {
          reply_markup: {
            force_reply: true,
          },
        },
      );
    }

    if (state.step === "ENTER_AMOUNT") {
      const amount = Number(ctx.message.text);

      if (Number.isNaN(amount) || amount <= 0) {
        return ctx.reply("❌ Please enter a valid amount.");
      }

      setAdminState(ctx.from.id, {
        ...state,
        step: "ENTER_NETWORK",
        amount,
      });

      return ctx.reply("Select the deposit network.", {
        reply_markup: networkKeyboard().reply_markup,
      });
    }

    if (state.step === "ENTER_TX_HASH") {
      setAdminState(ctx.from.id, {
        ...state,
        step: "ENTER_NOTES",
        txHash: ctx.message.text.trim(),
      });

      return ctx.reply("Enter notes for this credit.\n\nOr tap Skip.", {
        reply_markup: skipKeyboard("SKIP_NOTE").reply_markup,
      });
    }

    if (state.step === "ENTER_NOTES") {
      setAdminState(ctx.from.id, {
        ...state,
        step: "CONFIRM",
        notes: ctx.message.text,
      });

      return sendConfirmation(ctx);
    }

    return next();
  });
}
