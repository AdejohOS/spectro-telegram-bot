import { Markup } from "telegraf";

export function adminProductMenuKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("➕ Add Product", "ADD_PRODUCT")],

    [Markup.button.callback("📋 Products", "ADMIN_PRODUCT_LIST:1")],
    [Markup.button.callback("🛍️ Orders", "ADMIN_ORDERS")],

    [Markup.button.callback("⬅ Back", "ADMIN_PANEL")],
  ]);
}
