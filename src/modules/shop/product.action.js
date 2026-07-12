import {
  setProductState,
  getProductState,
  clearProductState,
} from "./product.state.js";

import { UserRepository } from "../users/user.repository.js";
import { ProductService } from "./product.service.js";
import { productDetailsContent } from "./product.content.js";
import { productDetailsKeyboard } from "./product.keyboard.js";
import { PRODUCT_STATUS } from "./product.status.js";

export function registerProductActions(bot) {
  bot.action("ADD_PRODUCT", async (ctx) => {
    await ctx.answerCbQuery();

    setProductState(ctx.from.id, {
      step: "TITLE",
    });

    await ctx.reply("📦 Enter product title.", {
      reply_markup: {
        force_reply: true,
      },
    });
  });
  bot.action("SAVE_PRODUCT", async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const state = getProductState(ctx.from.id);

      const admin = await UserRepository.findByTelegramId(ctx.from.id);

      const product = await ProductService.create({
        title: state.title,
        description: state.description,
        price: state.price,
        stock: state.stock,
        createdBy: admin.id,
      });

      clearProductState(ctx.from.id);

      await ctx.editMessageText(
        `✅ Product created successfully.

<code>${product.title}</code>`,
        {
          parse_mode: "HTML",
        },
      );
    } catch (error) {
      console.error(error);

      await ctx.reply(error.message);
    }
  });

  bot.action(/^VIEW_PRODUCT:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    const product = await ProductService.getProduct(ctx.match[1]);

    if (!product) {
      return ctx.reply("Product not found.");
    }

    await ctx.editMessageText(productDetailsContent(product), {
      parse_mode: "HTML",
      reply_markup: productDetailsKeyboard(product).reply_markup,
    });
  });
  bot.action(/^EDIT_PRODUCT_TITLE:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    setProductState(ctx.from.id, {
      step: "EDIT",
      field: "title",
      productId: ctx.match[1],
    });

    await ctx.reply("✏ Enter the new title.", {
      reply_markup: {
        force_reply: true,
      },
    });
  });
  bot.action(/^EDIT_PRODUCT_DESCRIPTION:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    setProductState(ctx.from.id, {
      step: "EDIT",
      field: "description",
      productId: ctx.match[1],
    });

    await ctx.reply("📝 Enter the new description.", {
      reply_markup: {
        force_reply: true,
      },
    });
  });
  bot.action(/^EDIT_PRODUCT_PRICE:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    setProductState(ctx.from.id, {
      step: "EDIT",
      field: "price",
      productId: ctx.match[1],
    });

    await ctx.reply("💰 Enter the new price.", {
      reply_markup: {
        force_reply: true,
      },
    });
  });
  bot.action(/^EDIT_PRODUCT_STOCK:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    setProductState(ctx.from.id, {
      step: "EDIT",
      field: "stock",
      productId: ctx.match[1],
    });

    await ctx.reply("📦 Enter the new stock quantity.", {
      reply_markup: {
        force_reply: true,
      },
    });
  });
  bot.action(/^ACTIVATE_PRODUCT:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const id = ctx.match[1];

      await ProductService.update(id, {
        status: PRODUCT_STATUS.ACTIVE,
      });

      const product = await ProductService.getProduct(id);

      await ctx.editMessageText(productDetailsContent(product), {
        parse_mode: "HTML",
        reply_markup: productDetailsKeyboard(product).reply_markup,
      });
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
  bot.action(/^DEACTIVATE_PRODUCT:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const id = ctx.match[1];

      await ProductService.update(id, {
        status: PRODUCT_STATUS.INACTIVE,
      });

      const product = await ProductService.getProduct(id);

      await ctx.editMessageText(productDetailsContent(product), {
        parse_mode: "HTML",
        reply_markup: productDetailsKeyboard(product).reply_markup,
      });
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
}
