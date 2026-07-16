import { formatMoney } from "../../utils/money.js";

export function userLookupContent() {
  return `👥 <b>User Lookup</b>

Choose how you would like to search for a user.`;
}

export function userDetailsContent(user) {
  return `👤 <b>User Profile</b>

━━━━━━━━━━━━━━━━━━

👤 <b>Name</b>

${user.firstName}

📛 <b>Username</b>

${user.username ? `@${user.username}` : "Not Set"}

🆔 <b>Telegram ID</b>

<code>${user.telegramId}</code>

━━━━━━━━━━━━━━━━━━

💰 <b>Wallet</b>

Available

<b>$${formatMoney(user.availableBalance ?? 0)}</b>

Locked

<b>$${formatMoney(user.lockedBalance ?? 0)}</b>

Total

<b>$${formatMoney(Number(user.availableBalance ?? 0) + Number(user.lockedBalance ?? 0))}</b>

━━━━━━━━━━━━━━━━━━

🛡 <b>Account</b>

Role

${user.role}

Status

${user.status}

Joined

${new Date(user.createdAt).toLocaleDateString()}`;
}
