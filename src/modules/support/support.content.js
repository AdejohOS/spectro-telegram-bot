function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export function supportContent(userId, supportUsername) {
  const username = supportUsername.replace(/^@/, "");
  const supportLink = `https://t.me/${username}`;

  return `🆘 <b>Spectro Support Center</b>
━━━━━━━━━━━━━━━━━━
Need help with your account or a transaction?
Our support team is here to help.

👨‍💻 <b>Support Agent</b>
<a href="${escapeHtml(supportLink)}">${escapeHtml(`@${username}`)}</a>
━━━━━━━━━━━━━━━━━━
<b>Common Issues</b>
💳 Deposit issues
💸 Withdrawal requests
🤝 Escrow disputes
🛒 Shop &amp; Orders
👛 Wallet balance issues
⚠️ Transaction failures
🔐 Account &amp; Security
━━━━━━━━━━━━━━━━━━
🕒 <b>Support Hours</b>
🤖 24/7 Automated Support
👨‍💼 Human Support
09:00 - 21:00 UTC
━━━━━━━━━━━━━━━━━━
<b>Your User ID</b>
<code>${escapeHtml(userId)}</code>
Please include your User ID and any transaction or order reference when contacting support.`;
}
