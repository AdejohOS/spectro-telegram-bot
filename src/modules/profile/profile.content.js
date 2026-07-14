import { formatMoney } from "../../utils/money.js";

export function profileMessage(profile) {
  const { user, wallet, stats } = profile;

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

🔒 Active Escrows
${stats.active}

❌ Rejected Escrows
${stats.rejected}

⚖️ Disputes
${stats.disputes}

━━━━━━━━━━━━━━━━━━

Thank you for using <b>Spectro</b> ❤️`;
}
