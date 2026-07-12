import { Markup } from "telegraf";
import { formatMoney } from "../../utils/money.js";

export function shopListKeyboard(page, totalPages, products) {
  const buttons = [];

  for (const product of products) {
    buttons.push([
      Markup.button.callback(
        `${product.title} • $${formatMoney(product.price)}`,
        `SHOP_PRODUCT:${product.id}`,
      ),
    ]);
  }

  const nav = [];

  if (page > 1) {
    nav.push(Markup.button.callback("⬅ Previous", `SHOP:${page - 1}`));
  }

  if (page < totalPages) {
    nav.push(Markup.button.callback("Next ➡", `SHOP:${page + 1}`));
  }

  if (nav.length) {
    buttons.push(nav);
  }

  buttons.push([Markup.button.callback("🏠 Main Menu", "MAIN_MENU")]);

  return Markup.inlineKeyboard(buttons);
}

export function shopProductKeyboard(product) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🛒 Buy Now", `BUY_PRODUCT:${product.id}`)],

    [Markup.button.callback("⬅ Shop", "SHOP:1")],
  ]);
}
