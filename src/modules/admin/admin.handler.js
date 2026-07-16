import { isAdmin } from "../../config/admin.js";
import { AdminService } from "./admin.service.js";
import {
  setAdminState,
  clearAdminState,
  getAdminState,
} from "./admin.state.js";

import { networkKeyboard } from "./admin.keyboard.js";
import { skipKeyboard } from "./admin.keyboard.js";
import { toMinorUnits } from "../../utils/money.js";
import { AddressRepository } from "../address/address.repository.js";

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
      const username = ctx.message.text.trim();

      if (!username.startsWith("@") || username.length === 1) {
        return ctx.reply(
          "Please enter the user's full username, including @. Example: @username001",
        );
      }

      const user = await AdminService.findUser("username", username.slice(1));

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

    if (state.step === "IMPORT_ADDRESSES") {
      const addresses = ctx.message.text
        .split(/\r?\n/)
        .map((a) => a.trim().replace(/,+$/, ""))
        .filter(Boolean);

      const uniqueAddresses = [...new Set(addresses)];

      const existing =
        await AddressRepository.findManyByAddress(uniqueAddresses);

      const existingSet = new Set(existing.map((a) => a.address));

      const values = [];

      let duplicates = 0;

      let invalid = 0;

      for (const address of addresses) {
        if (existingSet.has(address)) {
          duplicates++;
          continue;
        }
        if (
          state.network === "BTC" &&
          !/^(bc1|1|3)[a-zA-Z0-9]{20,}$/.test(address)
        ) {
          invalid++;
          continue;
        }
        if (state.network === "TRC20" && !/^T[a-zA-Z0-9]{33}$/.test(address)) {
          invalid++;
          continue;
        }

        values.push({
          network: state.network,
          address,
          status: "active",
        });

        clearAdminState(ctx.from.id);
      }

      if (values.length) {
        await AddressRepository.createMany(values);
      }

      return ctx.reply(
        `✅ Import Complete

━━━━━━━━━━━━━━

Network

${state.network}

Imported

${values.length}

Duplicates

${duplicates}

Invalid

${invalid}

Submitted

${addresses.length}`,
      );
    }

    return next();
  });
}
