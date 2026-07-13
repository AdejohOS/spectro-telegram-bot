import { formatMoney } from "../../utils/money.js";

export function profileMessage(profile) {
  const { user, wallet, stats, reputation } = profile;

  return `👤 <b>My Profile</b>

━━━━━━━━━━━━━━━━━━

<b>Account Information</b>

🆔 <b>User ID</b>
<code>${user.telegramId}</code>

👤 <b>Name</b>
${user.firstName ?? "N/A"}

📛 <b>Username</b>
${user.username ? `@${user.username}` : "Not Set"}

🛡 <b>Role</b>
${user.role}

📌 <b>Status</b>
${user.status}

📅 <b>Joined</b>
${new Date(user.createdAt).toLocaleDateString()}

━━━━━━━━━━━━━━━━━━

💰 <b>Wallet</b>

💵 Available
${formatMoney(Number(wallet.balance))} USDT

🔒 Locked
${formatMoney(Number(wallet.locked))} USDT

━━━━━━━━━━━━━━━━━━

📊 <b>Activity</b>

🤝 Completed Escrows
${stats.completed}

📦 Active Orders
${stats.active}

❌ Cancelled
${stats.cancelled}

⚖️ Disputes
${stats.disputes}

━━━━━━━━━━━━━━━━━━

⭐ <b>Reputation</b>

⭐ Rating
${reputation.rating}/5.0

📝 Reviews
${reputation.reviews}

━━━━━━━━━━━━━━━━━━

Thank you for using <b>Spectro</b> ❤️`;
}
