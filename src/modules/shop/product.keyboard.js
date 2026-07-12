import { Markup } from "telegraf";

export function productConfirmKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ Save", "SAVE_PRODUCT")],
    [Markup.button.callback("❌ Cancel", "ADMIN_PRODUCTS")],
  ]);
}

import { formatMoney } from "../../utils/money.js";

export function productListKeyboard(page, totalPages, products) {
  const buttons = [];

  for (const product of products) {
    buttons.push([
      Markup.button.callback(
        `${product.title} • $${formatMoney(product.price)}`,
        `VIEW_PRODUCT:${product.id}`,
      ),
    ]);
  }

  const nav = [];

  if (page > 1) {
    nav.push(
      Markup.button.callback("⬅ Previous", `ADMIN_PRODUCT_LIST:${page - 1}`),
    );
  }

  if (page < totalPages) {
    nav.push(
      Markup.button.callback("Next ➡", `ADMIN_PRODUCT_LIST:${page + 1}`),
    );
  }

  if (nav.length) {
    buttons.push(nav);
  }

  buttons.push([Markup.button.callback("⬅ Shop Manager", "ADMIN_PRODUCTS")]);

  return Markup.inlineKeyboard(buttons);
}

import { PRODUCT_STATUS } from "./product.status.js";

export function productDetailsKeyboard(product) {
  const buttons = [
    [
      Markup.button.callback(
        "✏ Edit Title",
        `EDIT_PRODUCT_TITLE:${product.id}`,
      ),
    ],

    [
      Markup.button.callback(
        "📝 Edit Description",
        `EDIT_PRODUCT_DESCRIPTION:${product.id}`,
      ),
    ],

    [
      Markup.button.callback(
        "💰 Change Price",
        `EDIT_PRODUCT_PRICE:${product.id}`,
      ),
    ],

    [
      Markup.button.callback(
        "📦 Change Stock",
        `EDIT_PRODUCT_STOCK:${product.id}`,
      ),
    ],
  ];

  if (product.status === PRODUCT_STATUS.ACTIVE) {
    buttons.push([
      Markup.button.callback(
        "🔴 Deactivate",
        `DEACTIVATE_PRODUCT:${product.id}`,
      ),
    ]);
  } else {
    buttons.push([
      Markup.button.callback("🟢 Activate", `ACTIVATE_PRODUCT:${product.id}`),
    ]);
  }

  buttons.push([Markup.button.callback("⬅ Products", "ADMIN_PRODUCT_LIST:1")]);

  return Markup.inlineKeyboard(buttons);
}
