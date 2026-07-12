import {
  getProductState,
  setProductState,
  clearProductState,
} from "./product.state.js";

import { ProductService } from "./product.service.js";
import { UserRepository } from "../users/user.repository.js";
import { sendProductConfirmation } from "./product.helper.js";
import { productDetailsContent } from "./product.content.js";
import { productDetailsKeyboard } from "./product.keyboard.js";

export function registerProductHandler(bot) {
  bot.on("text", async (ctx, next) => {
    const state = getProductState(ctx.from.id);

    if (!state) {
      return next();
    }

    // TITLE
    if (state.step === "TITLE") {
      setProductState(ctx.from.id, {
        step: "DESCRIPTION",
        title: ctx.message.text.trim(),
      });

      return ctx.reply("📝 Enter product description.", {
        reply_markup: {
          force_reply: true,
        },
      });
    }

    // DESCRIPTION
    if (state.step === "DESCRIPTION") {
      setProductState(ctx.from.id, {
        ...state,
        description: ctx.message.text.trim(),
        step: "PRICE",
      });

      return ctx.reply("💰 Enter product price.", {
        reply_markup: {
          force_reply: true,
        },
      });
    }

    // PRICE
    if (state.step === "PRICE") {
      const price = Number(ctx.message.text);

      if (Number.isNaN(price) || price <= 0) {
        return ctx.reply("❌ Invalid price.");
      }

      setProductState(ctx.from.id, {
        ...state,
        price,
        step: "STOCK",
      });

      return ctx.reply("📦 Enter stock quantity.", {
        reply_markup: {
          force_reply: true,
        },
      });
    }

    // STOCK
    if (state.step === "STOCK") {
      const stock = Number(ctx.message.text);

      if (Number.isNaN(stock) || stock < 0) {
        return ctx.reply("❌ Invalid stock.");
      }

      setProductState(ctx.from.id, {
        ...state,
        stock,
        step: "CONFIRM",
      });

      return sendProductConfirmation(ctx);
    }

    if (state.step === "EDIT") {
      let value = ctx.message.text.trim();

      if (state.field === "price") {
        value = Number(value);

        if (Number.isNaN(value) || value <= 0) {
          return ctx.reply("Invalid price.");
        }
      }

      if (state.field === "stock") {
        value = Number(value);

        if (Number.isNaN(value) || value < 0) {
          return ctx.reply("Invalid stock.");
        }
      }

      await ProductService.update(state.productId, {
        [state.field]: value,
      });

      clearProductState(ctx.from.id);

      const product = await ProductService.getProduct(state.productId);

      await ctx.reply(productDetailsContent(product), {
        parse_mode: "HTML",

        reply_markup: productDetailsKeyboard(product).reply_markup,
      });
    }

    return next();
  });
}
