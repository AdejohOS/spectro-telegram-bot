import {
  addressPoolKeyboard,
  networkAddressKeyboard,
  addressListKeyboard,
} from "./address.keyboard.js";
import { addressPoolContent, networkContent } from "./address.content.js";
import { setAdminState } from "../admin/admin.state.js";
import { AddressRepository } from "./address.repository.js";
import {
  addressStatisticsContent,
  addressListContent,
} from "./address.content.js";

export function registerAddressActions(bot) {
  bot.action("ADDRESS_POOL", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(addressPoolContent(), {
      parse_mode: "HTML",
      reply_markup: addressPoolKeyboard().reply_markup,
    });
  });
  bot.action("ADDRESS_POOL_BTC", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(networkContent("BTC"), {
      parse_mode: "HTML",
      reply_markup: networkAddressKeyboard("BTC").reply_markup,
    });
  });
  bot.action("ADDRESS_POOL_TRC20", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(networkContent("TRC20"), {
      parse_mode: "HTML",
      reply_markup: networkAddressKeyboard("TRC20").reply_markup,
    });
  });
  bot.action(/^IMPORT_(BTC|TRC20)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const network = ctx.match[1];

    setAdminState(ctx.from.id, {
      step: "IMPORT_ADDRESSES",
      network,
    });

    await ctx.reply(
      `📥 Import ${network} Addresses

Paste one address per line.

Example:

${
  network === "BTC"
    ? `bc1q123...
bc1q456...
bc1q789...`
    : `TNabc...
TNdef...
TNghi...`
}`,
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  });
  bot.action(/^VIEW_(BTC|TRC20)(?::(\d+))?$/, async (ctx) => {
    await ctx.answerCbQuery();

    const network = ctx.match[1];

    const page = Number(ctx.match[2] ?? 1);

    const limit = 10;

    const addresses = await AddressRepository.findByNetworkPag(
      network,
      page,
      limit,
    );

    const total = await AddressRepository.countByNetwork(network);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    await ctx.editMessageText(
      addressListContent(network, addresses, page, totalPages),
      {
        parse_mode: "HTML",
        reply_markup: addressListKeyboard(network, page, totalPages)
          .reply_markup,
      },
    );
  });
  bot.action(/^STATS_(BTC|TRC20)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const network = ctx.match[1];

    const stats = await AddressRepository.statistics(network);

    await ctx.editMessageText(addressStatisticsContent(network, stats), {
      parse_mode: "HTML",
      reply_markup: networkAddressKeyboard(network).reply_markup,
    });
  });
}
