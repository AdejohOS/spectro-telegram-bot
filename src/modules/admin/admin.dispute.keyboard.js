import { Markup } from "telegraf";
import { formatMoney } from "../../utils/money.js";

export function adminDisputeKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🟡 Pending Disputes", "ADMIN_PENDING_DISPUTES:1")],

    [Markup.button.callback("✅ Settled Disputes", "ADMIN_SETTLED_DISPUTES:1")],

    [Markup.button.callback("⬅ Admin Panel", "ADMIN_PANEL")],
  ]);
}

export function pendingDisputesKeyboard(escrows, page, totalPages) {
  const buttons = [];

  for (const escrow of escrows) {
    buttons.push([
      Markup.button.callback(
        `${escrow.escrowNumber}

• $${formatMoney(escrow.amount)}`,

        `VIEW_ESCROW:${escrow.id}`,
      ),
    ]);
  }

  const nav = [];

  if (page > 1) {
    nav.push(
      Markup.button.callback(
        "⬅ Previous",

        `ADMIN_PENDING_DISPUTES:${page - 1}`,
      ),
    );
  }

  if (page < totalPages) {
    nav.push(
      Markup.button.callback(
        "Next ➡",

        `ADMIN_PENDING_DISPUTES:${page + 1}`,
      ),
    );
  }

  if (nav.length) {
    buttons.push(nav);
  }

  buttons.push([
    Markup.button.callback(
      "⬅ Dispute Center",

      "ADMIN_DISPUTES",
    ),
  ]);

  return Markup.inlineKeyboard(buttons);
}

export function adminEscrowKeyboard(escrow) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "✅ Release to Seller",
        `ADMIN_RELEASE_ESCROW:${escrow.id}`,
      ),
    ],

    [
      Markup.button.callback(
        "↩ Refund Buyer",
        `ADMIN_REFUND_ESCROW:${escrow.id}`,
      ),
    ],

    [Markup.button.callback("⬅ Pending Disputes", "ADMIN_PENDING_DISPUTES:1")],
  ]);
}
