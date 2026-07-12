import { formatMoney } from "../../utils/money.js";

export function adminDisputeContent() {
  return `
<b>⚖️ Dispute Center</b>

━━━━━━━━━━━━━━

Manage all escrow disputes from here.

🟡 Pending

Review disputes awaiting a decision.

✅ Settled

View disputes already resolved.

━━━━━━━━━━━━━━

Select a category below.
`;
}

export function pendingDisputesContent(data) {
  if (!data.escrows.length) {
    return `

<b>🟡 Pending Disputes</b>

No pending disputes.

`;
  }

  const start = (data.page - 1) * data.limit + 1;

  const end = Math.min(
    data.page * data.limit,

    data.total,
  );

  let text = `<b>🟡 Pending Disputes</b>

Showing ${start}-${end}
of ${data.total}

`;

  for (const escrow of data.escrows) {
    text += `

━━━━━━━━━━━━━━

<code>

${escrow.escrowNumber}

</code>

💰

$${formatMoney(escrow.amount)}

`;
  }

  return text;
}
