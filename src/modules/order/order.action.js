import {
  adminOrdersKeyboard,
  buyerDeliveredKeyboard,
} from "./order.keyboard.js";
import { OrderService } from "./order.service.js";
import { orderListContent } from "./order.content.js";
import { orderListKeyboard, orderDetailsKeyboard } from "./order.keyboard.js";
import { UserRepository } from "../users/user.repository.js";
import { formatMoney } from "../../utils/money.js";
import { Markup } from "telegraf";
import { orderDetailsContent } from "./order.content.js";

import { ORDER_STATUS } from "../shop/product.status.js";

export function registerOrderActions(bot) {
  bot.action(
    "ADMIN_ORDERS",

    async (ctx) => {
      await ctx.answerCbQuery();

      await ctx.editMessageText(
        `🛍️ <b>Orders Manager</b>
  
  Choose an option.`,

        {
          parse_mode: "HTML",

          reply_markup: adminOrdersKeyboard().reply_markup,
        },
      );
    },
  );
  bot.action(
    /^BUY_PRODUCT:(.+)$/,

    async (ctx) => {
      await ctx.answerCbQuery();

      try {
        const order = await OrderService.create(ctx.match[1], ctx.from.id);
        const details = await OrderService.getOrder(order.id);

        const admins = await UserRepository.findAdmins();

        console.log("ORDER:", order);

        for (const admin of admins) {
          await ctx.telegram.sendMessage(
            admin.telegramId,

            `🛒 <b>New Shop Order</b>

<b>Order</b>

<code>${details.orderNumber}</code>

<b>Buyer</b>

@${details.buyerUsername || "N/A"}

<b>Product</b>

${details.productTitle}

<b>Amount</b>

💰 ${formatMoney(details.amount)}

<b>Status</b>

🟡 Pending`,
            {
              parse_mode: "HTML",

              reply_markup: Markup.inlineKeyboard([
                [
                  Markup.button.callback(
                    "👁 View Order",
                    `VIEW_ORDER:${details.id}`,
                  ),
                ],
              ]).reply_markup,
            },
          );
        }

        await ctx.editMessageText(
          `✅ <b>Order Created</b>

Reference

<code>${order.orderNumber}</code>

Funds have been securely locked.

The seller has been notified.`,

          {
            parse_mode: "HTML",
          },
        );
      } catch (error) {
        console.error(error);

        await ctx.reply(error.message);
      }
    },
  );
  bot.action(
    /^ADMIN_ORDER_LIST:(.+):(\d+)$/,

    async (ctx) => {
      await ctx.answerCbQuery();

      const status = ctx.match[1];

      const page = Number(ctx.match[2]);

      const result = await OrderService.adminList(status, page);

      const totalPages = Math.max(1, Math.ceil(result.total / result.limit));

      await ctx.editMessageText(
        orderListContent(
          status,

          result.orders,

          page,

          totalPages,
        ),

        {
          parse_mode: "HTML",

          reply_markup: orderListKeyboard(
            status,

            page,

            totalPages,

            result.orders,
          ).reply_markup,
        },
      );
    },
  );

  bot.action(/^PROCESS_ORDER:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    await OrderService.updateStatus(ctx.match[1], ORDER_STATUS.PROCESSING);

    const order = await OrderService.getOrder(ctx.match[1]);

    await ctx.telegram.sendMessage(
      order.buyerTelegramId,
      `📦 Your order is now being processed.`,
      {
        parse_mode: "HTML",
      },
    );

    await ctx.editMessageText(orderDetailsContent(order), {
      parse_mode: "HTML",
      reply_markup: orderDetailsKeyboard(order).reply_markup,
    });
  });
  bot.action(/^VIEW_ORDER:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const order = await OrderService.getOrder(ctx.match[1]);

      if (!order) {
        return ctx.reply("Order not found.");
      }

      await ctx.editMessageText(orderDetailsContent(order), {
        parse_mode: "HTML",
        reply_markup: orderDetailsKeyboard(order).reply_markup,
      });
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
  bot.action(/^SHIP_ORDER:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const id = ctx.match[1];

      await OrderService.updateStatus(id, ORDER_STATUS.SHIPPED);

      const order = await OrderService.getOrder(id);

      // Notify buyer
      await ctx.telegram.sendMessage(
        order.buyerTelegramId,
        `🚚 <b>Your order has been shipped.</b>

Reference

<code>${order.orderNumber}</code>

Your package is on its way!`,
        {
          parse_mode: "HTML",
        },
      );

      // Refresh admin screen
      await ctx.editMessageText(orderDetailsContent(order), {
        parse_mode: "HTML",
        reply_markup: orderDetailsKeyboard(order).reply_markup,
      });
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
  bot.action(/^DELIVER_ORDER:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const id = ctx.match[1];

      await OrderService.updateStatus(id, ORDER_STATUS.DELIVERED);

      const order = await OrderService.getOrder(id);

      await ctx.telegram.sendMessage(
        order.buyerTelegramId,
        `📦 <b>Your order has been marked as delivered.</b>

Reference

<code>${order.orderNumber}</code>

Please confirm once you have received it.`,
        {
          parse_mode: "HTML",
          reply_markup: buyerDeliveredKeyboard(order.id).reply_markup,
        },
      );

      await ctx.editMessageText(orderDetailsContent(order), {
        parse_mode: "HTML",
        reply_markup: orderDetailsKeyboard(order).reply_markup,
      });
    } catch (error) {
      console.error(error);
      await ctx.reply(error.message);
    }
  });
  bot.action(/^CONFIRM_ORDER:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    try {
      const order = await OrderService.complete(ctx.match[1]);

      const details = await OrderService.getOrder(order.id);

      const admins = await UserRepository.findAdmins();

      for (const admin of admins) {
        await ctx.telegram.sendMessage(
          admin.telegramId,

          `✅ <b>Order Completed</b>

Reference

<code>${details.orderNumber}</code>

Buyer

@${details.buyerUsername || "N/A"}

Funds have been released.`,

          {
            parse_mode: "HTML",
          },
        );
      }

      await ctx.editMessageText(
        `🎉 <b>Order Completed</b>

Reference

<code>${order.orderNumber}</code>

Your payment has been released.

Thank you for shopping with Spectro.`,

        {
          parse_mode: "HTML",
        },
      );
    } catch (error) {
      console.error(error);

      await ctx.reply(error.message);
    }
  });
}
