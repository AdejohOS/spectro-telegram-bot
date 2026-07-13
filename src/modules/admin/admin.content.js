import { formatMoney } from "../../utils/money.js";

export function creditConfirmation(state) {
  return `
💳 *Confirm Wallet Credit*

━━━━━━━━━━━━━━━━━━

👤 User

${state.user.firstName}

${state.user.username ? `@${state.user.username}` : "No Username"}

💰 Amount

*$${formatMoney(state.amount)}*

🌐 Network

${state.network}

🔗 Transaction Hash

${state.txHash ?? "Not Provided"}

📝 Notes

${state.notes ?? "Not Provided"}

━━━━━━━━━━━━━━━━━━

Press *Confirm* to credit the wallet.
`;
}
export function withdrawalListContent(title, withdrawals, page, totalPages) {
  let text = `<b>${title}</b>\n\n`;

  if (!withdrawals.length) {
    return text + "No withdrawals found.";
  }

  text += `Page ${page} of ${totalPages}\n\n`;

  withdrawals.forEach((w, index) => {
    text += `${index + 1}. <code>${w.reference}</code>\n`;
    text += `💰 ${formatMoney(w.amount)}\n`;
    text += `🌐 ${w.network}\n\n`;
  });

  return text;
}
export function adminWithdrawalDetailsContent(withdrawal) {
  return `<b>💸 Withdrawal Details</b>

━━━━━━━━━━━━━━

<b>Reference</b>

<code>${withdrawal.reference}</code>

<b>User</b>

@${withdrawal.username || "N/A"}

${withdrawal.firstName}

<b>Amount</b>

💰 ${formatMoney(withdrawal.amount)} USDT

<b>Network</b>

${withdrawal.network}

<b>Wallet Address</b>

<code>${withdrawal.address}</code>

<b>Status</b>

${withdrawal.status.toUpperCase()}

━━━━━━━━━━━━━━`;
}

export function statisticsContent(stats) {
  return `📊 <b>Platform Statistics</b>

━━━━━━━━━━━━━━━━━━

👥 <b>Users</b>

Total Users
${stats.totalUsers}

━━━━━━━━━━━━━━━━━━

₿ <b>Bitcoin Addresses</b>

Total
${stats.btcTotal}

Assigned
${stats.btcAssigned}

Available
${stats.btcAvailable}

━━━━━━━━━━━━━━━━━━

💵 <b>TRC20 Addresses</b>

Total
${stats.trcTotal}

Assigned
${stats.trcAssigned}

Available
${stats.trcAvailable}

━━━━━━━━━━━━━━━━━━

👛 <b>Wallets</b>

Available Balance

${formatMoney(stats.totalWallet)} USDT

Locked Balance

${formatMoney(stats.totalLocked)} USDT

━━━━━━━━━━━━━━━━━━

🤝 Escrows

${stats.totalEscrows}

🛒 Orders

${stats.totalOrders}

💸 Withdrawals

${stats.totalWithdrawals}

📦 Products

${stats.totalProducts}`;
}
