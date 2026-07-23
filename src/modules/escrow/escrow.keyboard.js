import { Markup } from "telegraf";
import { ESCROW_STATUS } from "../../utils/references.js";
import { formatMoney } from "../../utils/money.js";

export function escrowKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("➕ Create Escrow", "CREATE_ESCROW")],
    [
      Markup.button.callback(
        "📥 Pending Requests",
        "ESCROW_LIST:awaiting_seller:1",
      ),
      Markup.button.callback("⏳ Active Escrows", "ESCROW_ACTIVE:1"),
    ],

    [
      Markup.button.callback("⏳ Cancelled", "ESCROW_LIST:cancelled:1"),
      Markup.button.callback("✅ Completed", "ESCROW_LIST:completed:1"),
    ],
    [
      Markup.button.callback("❌ Rejected", "ESCROW_LIST:rejected:1"),
      Markup.button.callback("⚠️ Disputes", "ESCROW_LIST:disputed:1"),
    ],

    [Markup.button.callback("📜 Escrow History", "ESCROW_HISTORY")],

    [Markup.button.callback("⬅️ Back to Main Menu", "MAIN_MENU")],
  ]);
}

export function confirmEscrowKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ Create Escrow", "CONFIRM_ESCROW")],
    [Markup.button.callback("❌ Cancel", "CANCEL_ESCROW")],
  ]);
}

export function sellerEscrowKeyboard(escrowId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ Accept", `ACCEPT_ESCROW:${escrowId}`)],
    [Markup.button.callback("❌ Reject", `REJECT_ESCROW:${escrowId}`)],
  ]);
}

export function escrowListKeyboard(status, page, totalPages, escrows) {
  const buttons = [];

  for (const escrow of escrows) {
    buttons.push([
      Markup.button.callback(
        `${escrow.escrowNumber} • $${formatMoney(escrow.amount)}`,
        `VIEW_ESCROW:${escrow.id}`,
      ),
    ]);
  }

  const nav = [];

  if (page > 1) {
    nav.push(
      Markup.button.callback("⬅ Previous", `ESCROW_LIST:${status}:${page - 1}`),
    );
  }

  if (page < totalPages) {
    nav.push(
      Markup.button.callback("Next ➡", `ESCROW_LIST:${status}:${page + 1}`),
    );
  }

  if (nav.length) {
    buttons.push(nav);
  }

  buttons.push([Markup.button.callback("🏠 Escrow Menu", "ESCROW_PANEL")]);

  return Markup.inlineKeyboard(buttons);
}

export function pendingEscrowsKeyboard(escrows) {
  return Markup.inlineKeyboard([
    ...escrows.map((escrow) => [
      Markup.button.callback(
        `${escrow.escrowNumber} • $${formatMoney(escrow.amount)}`,
        `VIEW_ESCROW:${escrow.id}`,
      ),
    ]),
    [Markup.button.callback("⬅ Escro Menu", "ESCROW_PANEL")],
  ]);
}

export function escrowDetailsKeyboard(escrow, currentUserId) {
  const buttons = [];

  // Seller accepts/rejects
  if (
    escrow.status === ESCROW_STATUS.PENDING_SELLER &&
    escrow.sellerTelegramId === currentUserId
  ) {
    buttons.push([
      Markup.button.callback("✅ Accept", `ACCEPT_ESCROW:${escrow.id}`),
      Markup.button.callback("❌ Reject", `REJECT_ESCROW:${escrow.id}`),
    ]);
  }

  // Buyer can cancel before seller accepts
  if (
    escrow.status === ESCROW_STATUS.PENDING_SELLER &&
    escrow.buyerTelegramId === currentUserId
  ) {
    buttons.push([
      Markup.button.callback(
        "❌ Cancel Escrow",
        `CANCEL_PENDING_ESCROW:${escrow.id}`,
      ),
    ]);
  }

  // Seller marks delivered
  if (
    escrow.status === ESCROW_STATUS.ACCEPTED &&
    escrow.sellerTelegramId === currentUserId
  ) {
    buttons.push([
      Markup.button.callback(
        "📦 Mark Delivered",
        `DELIVER_ESCROW:${escrow.id}`,
      ),
    ]);
  }

  //// Buyer can dispute once seller has accepted
  if (
    (escrow.status === ESCROW_STATUS.ACCEPTED ||
      escrow.status === ESCROW_STATUS.DELIVERED) &&
    escrow.buyerTelegramId === currentUserId
  ) {
    if (escrow.status === ESCROW_STATUS.DELIVERED) {
      buttons.push([
        Markup.button.callback(
          "✅ Release Payment",
          `RELEASE_ESCROW:${escrow.id}`,
        ),
      ]);
    }

    buttons.push([
      Markup.button.callback("⚖️ Open Dispute", `DISPUTE_ESCROW:${escrow.id}`),
    ]);
  }

  buttons.push([Markup.button.callback("⬅ Back", "ESCROW_PENDING")]);

  return Markup.inlineKeyboard(buttons);
}

export function viewEscrowKeyboard(escrowId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("👁 View Escrow", `VIEW_ESCROW:${escrowId}`)],
  ]);
}

export function escrowHistoryKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📥 Pending", "ESCROW_LIST:awaiting_seller:1")],

    [Markup.button.callback("💰 Cancelled", "ESCROW_LIST:cancelled:1")],

    [Markup.button.callback("🔒 Active", "ESCROW_ACTIVE:1")],

    [Markup.button.callback("✅ Completed", "ESCROW_LIST:completed:1")],

    [Markup.button.callback("❌ Rejected", "ESCROW_LIST:rejected:1")],

    [Markup.button.callback("⚖️ Disputed", "ESCROW_LIST:disputed:1")],

    [Markup.button.callback("⬅ Escrow Menu", "ESCROW_PANEL")],
  ]);
}
