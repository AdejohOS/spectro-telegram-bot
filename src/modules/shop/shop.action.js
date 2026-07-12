import { ProductService } from "./product.service.js";
import { shopListContent, shopProductContent } from "./shop.content.js";
import { shopListKeyboard, shopProductKeyboard } from "./shop.keyboard.js";

export function registerShopActions(bot) {
  bot.action("SHOP", async (ctx) => {
    await ctx.answerCbQuery();

    const result = await ProductService.list(1);

    const totalPages = Math.max(1, Math.ceil(result.total / result.limit));

    await ctx.editMessageText(shopListContent(result.products, 1, totalPages), {
      parse_mode: "HTML",
      reply_markup: shopListKeyboard(1, totalPages, result.products)
        .reply_markup,
    });
  });

  bot.action(/^SHOP:(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const page = Number(ctx.match[1]);

    const result = await ProductService.list(page);

    const totalPages = Math.max(1, Math.ceil(result.total / result.limit));

    await ctx.editMessageText(
      shopListContent(result.products, page, totalPages),

      {
        parse_mode: "HTML",

        reply_markup: shopListKeyboard(page, totalPages, result.products)
          .reply_markup,
      },
    );
  });
  bot.action(
    /^SHOP_PRODUCT:(.+)$/,

    async (ctx) => {
      await ctx.answerCbQuery();

      const product = await ProductService.getProduct(ctx.match[1]);

      await ctx.editMessageText(
        shopProductContent(product),

        {
          parse_mode: "HTML",

          reply_markup: shopProductKeyboard(product).reply_markup,
        },
      );
    },
  );
}
