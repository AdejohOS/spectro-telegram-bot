import { formatMoney } from "../../utils/money.js";
import { escrowStatusLabel } from "../../utils/references.js";

export function escrowConfirmation(state) {
  return `
🤝 *Confirm Escrow*

👤 Seller:
@${state.seller.username}

💰 Amount:
*$${formatMoney(state.amount)}*

📦 Title:
${state.title}

📝 Description:
${state.description}

━━━━━━━━━━━━━━

Do you want to create this escrow?
`;
}

export function pendingEscrowsContent(escrows, currentUserId) {
  if (!escrows.length) {
    return `
<b>📥 Pending Requests</b>

You have no pending escrow requests.
`;
  }

  let text = `<b>📥 Pending Requests (${escrows.length})</b>\n\n`;

  escrows.forEach((escrow) => {
    const isBuyer = escrow.buyerId === currentUserId;

    text += `
━━━━━━━━━━━━━━

📦 <b>${escrow.title}</b>

<code>${escrow.escrowNumber}</code>

${isBuyer ? "🛍 <b>Seller:</b>" : "👤 <b>Buyer:</b>"}
@${isBuyer ? escrow.sellerUsername : escrow.buyerUsername}

💰 <b>Amount:</b>
$${formatMoney(escrow.amount)}

📌 <b>Status:</b>
🟡 Pending Seller

`;
  });

  return text;
}

export function escrowDetailsContent(escrow) {
  return `
<b>🤝 Escrow Details</b>
 
━━━━━━━━━━━━━━━━━━

<b>Escrow</b>

<code>${escrow.escrowNumber}</code>

<b>Status</b>

${escrowStatusLabel(escrow.status)}

━━━━━━━━━━━━━━━━━━

<b>Buyer</b>

@${escrow.buyerUsername}

<b>Seller</b>

@${escrow.sellerUsername}

━━━━━━━━━━━━━━━━━━

<b>Amount</b>

💰 <b>$${formatMoney(escrow.amount)}</b>

━━━━━━━━━━━━━━━━━━

<b>Title</b>

${escrow.title}

<b>Description</b>

${escrow.description}

━━━━━━━━━━━━━━━━━━

<b>Created</b>

${new Date(escrow.createdAt).toLocaleString()}
`;
}

export function escrowListContent(title, escrows, page, total, limit) {
  if (!escrows.length) {
    return `<b>${title}</b>

No escrows found.`;
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  let text = `<b>${title}</b>

Showing ${start}-${end} of ${total}

`;

  for (const escrow of escrows) {
    text += `━━━━━━━━━━━━━━

<code>${escrow.escrowNumber}</code>

📦 ${escrow.title}

💰 $${formatMoney(escrow.amount)}

${escrowStatusLabel(escrow.status)}

`;
  }

  return text;
}

export function escrowHistoryContent(summary) {
  return `

<b>📜 Escrow History</b>

━━━━━━━━━━━━━━

📥 Pending

<b>${summary.pending}</b>

💰 Awaiting Funding

<b>${summary.funding}</b>

🔒 Active

<b>${summary.active}</b>

✅ Completed

<b>${summary.completed}</b>

❌ Rejected

<b>${summary.rejected}</b>

⚖️ Disputed

<b>${summary.disputed}</b>

━━━━━━━━━━━━━━

Select a category below.

`;
}
