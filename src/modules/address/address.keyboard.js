import { Markup } from "telegraf";

export function addressPoolKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("₿ Bitcoin", "ADDRESS_POOL_BTC")],
    [Markup.button.callback("💵 TRC20", "ADDRESS_POOL_TRC20")],
    [Markup.button.callback("⬅ Admin Panel", "ADMIN_PANEL")],
  ]);
}

export function networkAddressKeyboard(network) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("➕ Import Addresses", `IMPORT_${network}`)],
    [Markup.button.callback("📋 View Addresses", `VIEW_${network}`)],
    [Markup.button.callback("📊 Statistics", `STATS_${network}`)],
    [Markup.button.callback("⬅ Back", "ADDRESS_POOL")],
  ]);
}
export function addressListKeyboard(network, page, totalPages) {
  const rows = [];

  if (page > 1 || page < totalPages) {
    rows.push([
      ...(page > 1
        ? [Markup.button.callback("⬅ Prev", `VIEW_${network}:${page - 1}`)]
        : []),

      ...(page < totalPages
        ? [Markup.button.callback("Next ➡", `VIEW_${network}:${page + 1}`)]
        : []),
    ]);
  }

  rows.push([Markup.button.callback("⬅ Back", `ADDRESS_POOL_${network}`)]);

  return Markup.inlineKeyboard(rows);
}
