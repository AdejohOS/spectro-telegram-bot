import { Markup } from "telegraf";
import { formatMoney } from "../../utils/money.js";

export function adminOrdersKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🟡 Pending", "ADMIN_ORDER_LIST:pending:1")],

    [Markup.button.callback("🚚 Processing", "ADMIN_ORDER_LIST:processing:1")],

    [Markup.button.callback("🚛 Shipped", "ADMIN_ORDER_LIST:shipped:1")],

    [Markup.button.callback("✅ Completed", "ADMIN_ORDER_LIST:completed:1")],

    [Markup.button.callback("⚖️ Disputed", "ADMIN_ORDER_LIST:disputed:1")],

    [Markup.button.callback("⬅ Shop", "ADMIN_PRODUCTS")],
  ]);
}
export function orderListKeyboard(status, page, totalPages, orders) {
  const buttons = [];

  for (const order of orders) {
    buttons.push([
      Markup.button.callback(
        `${order.orderNumber} • $${formatMoney(order.amount)}`,

        `VIEW_ORDER:${order.id}`,
      ),
    ]);
  }

  const nav = [];

  if (page > 1) {
    nav.push(
      Markup.button.callback(
        "⬅ Previous",

        `ADMIN_ORDER_LIST:${status}:${page - 1}`,
      ),
    );
  }

  if (page < totalPages) {
    nav.push(
      Markup.button.callback(
        "Next ➡",

        `ADMIN_ORDER_LIST:${status}:${page + 1}`,
      ),
    );
  }

  if (nav.length) {
    buttons.push(nav);
  }

  buttons.push([
    Markup.button.callback(
      "🏠 Orders",

      "ADMIN_ORDERS",
    ),
  ]);

  return Markup.inlineKeyboard(buttons);
}

import { ORDER_STATUS } from "../shop/product.status.js";

export function orderDetailsKeyboard(order) {
  const buttons = [];

  switch (order.status) {
    case ORDER_STATUS.PENDING:
      buttons.push([
        Markup.button.callback(
          "📦 Start Processing",
          `PROCESS_ORDER:${order.id}`,
        ),
      ]);
      break;

    case ORDER_STATUS.PROCESSING:
      buttons.push([
        Markup.button.callback("🚚 Mark Shipped", `SHIP_ORDER:${order.id}`),
      ]);
      break;

    case ORDER_STATUS.SHIPPED:
      buttons.push([
        Markup.button.callback(
          "📍 Mark Delivered",
          `DELIVER_ORDER:${order.id}`,
        ),
      ]);
      break;
  }

  buttons.push([
    Markup.button.callback("⬅ Orders", `ADMIN_ORDER_LIST:${order.status}:1`),
  ]);

  return Markup.inlineKeyboard(buttons);
}
export function buyerDeliveredKeyboard(orderId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ Confirm Delivery", `CONFIRM_ORDER:${orderId}`)],
    [Markup.button.callback("⚖️ Report Problem", `DISPUTE_ORDER:${orderId}`)],
  ]);
}
