import { formatMoney } from "../../utils/money.js";

export function userTransactionsContent(
  user,
  transactions,
  page,
  total,
  limit,
) {
  if (!transactions.length) {
    return `<b>📜 Transaction History</b>
━━━━━━━━━━━━━━━━━━
👤 <b>User</b>

${user.username ? `@${user.username}` : user.firstName}

━━━━━━━━━━━━━━━━━━
No transactions found.`;
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  let text = `<b>📜 Transaction History</b>
━━━━━━━━━━━━━━━━━━
👤 <b>User</b>

${user.username ? `@${user.username}` : user.firstName}

Showing ${start}-${end} of ${total}

`;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);

    const isCredit =
      transaction.type === "deposit" ||
      transaction.type === "credit" ||
      transaction.type === "admin_credit";

    const sign = isCredit ? "+" : "-";

    text += `━━━━━━━━━━━━━━━━━━
${isCredit ? "💰" : "💸"} <b>${transaction.type.toUpperCase()}</b>

<b>Amount:</b>
${sign}$${formatMoney(Math.abs(amount))}

<b>Before:</b>
$${formatMoney(transaction.balanceBefore)}

<b>After:</b>
$${formatMoney(transaction.balanceAfter)}

<b>Status:</b>
${transaction.status}
`;

    if (transaction.reference) {
      text += `
<b>Reference:</b>
<code>${transaction.reference}</code>
`;
    }

    if (transaction.notes) {
      text += `
<b>Notes:</b>
${transaction.notes}
`;
    }

    text += `
<b>Date:</b>
${new Date(transaction.createdAt).toLocaleString()}

`;
  }

  return text;
}
