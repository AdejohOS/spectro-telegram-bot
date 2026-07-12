import { Markup } from "telegraf";
import { formatMoney } from "../../utils/money.js";

import { WITHDRAWAL_STATUS } from "../withdrawal/withdrawal.status.js";

export function adminWithdrawalMenuKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🟡 Pending", "ADMIN_WITHDRAWAL_LIST:pending:1")],

    [
      Markup.button.callback(
        "✅ Completed",
        "ADMIN_WITHDRAWAL_LIST:completed:1",
      ),
    ],

    [Markup.button.callback("❌ Rejected", "ADMIN_WITHDRAWAL_LIST:rejected:1")],

    [Markup.button.callback("⬅ Back", "ADMIN_PANEL")],
  ]);
}

export function withdrawalListKeyboard(status, page, totalPages, withdrawals) {
  const buttons = [];

  for (const withdrawal of withdrawals) {
    buttons.push([
      Markup.button.callback(
        `${withdrawal.reference} • $${formatMoney(withdrawal.amount)}`,
        `ADMIN_VIEW_WITHDRAWAL:${withdrawal.id}`,
      ),
    ]);
  }

  const nav = [];

  if (page > 1) {
    nav.push(
      Markup.button.callback(
        "⬅ Previous",
        `ADMIN_WITHDRAWAL_LIST:${status}:${page - 1}`,
      ),
    );
  }

  if (page < totalPages) {
    nav.push(
      Markup.button.callback(
        "Next ➡",
        `ADMIN_WITHDRAWAL_LIST:${status}:${page + 1}`,
      ),
    );
  }

  if (nav.length) {
    buttons.push(nav);
  }

  buttons.push([
    Markup.button.callback("🏠 Withdrawal Menu", "ADMIN_WITHDRAWALS"),
  ]);

  return Markup.inlineKeyboard(buttons);
}

export function adminWithdrawalDetailsKeyboard(withdrawal) {
  const buttons = [];

  if (withdrawal.status === WITHDRAWAL_STATUS.PENDING) {
    buttons.push([
      Markup.button.callback(
        "✅ Approve",
        `ADMIN_APPROVE_WITHDRAWAL:${withdrawal.id}`,
      ),
    ]);

    buttons.push([
      Markup.button.callback(
        "❌ Reject",
        `ADMIN_REJECT_WITHDRAWAL:${withdrawal.id}`,
      ),
    ]);
  }

  buttons.push([
    Markup.button.callback(
      "⬅ Back",
      `ADMIN_WITHDRAWAL_LIST:${withdrawal.status}:1`,
    ),
  ]);

  return Markup.inlineKeyboard(buttons);
}
