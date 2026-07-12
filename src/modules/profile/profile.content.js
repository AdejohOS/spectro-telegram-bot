export function profileMessage(profile) {
  const { user, wallet, stats, reputation } = profile;

  return `
👤 *Your Profile*

🆔 *User ID:* \`${user.telegramId}\`
👤 *Name:* ${user.firstName ?? "N/A"}
📛 *Username:* ${user.username ? `@${user.username}` : "Not set"}

━━━━━━━━━━━━━━━━━━

💰 *Wallet*

Available: *$${wallet.balance.toLocaleString()}*
Locked: *$${wallet.locked.toLocaleString()}*

━━━━━━━━━━━━━━━━━━

📊 *Trading Statistics*

🛒 Completed: *${stats.completed}*
🟢 Active: *${stats.active}*
❌ Cancelled: *${stats.cancelled}*
⚖️ Disputes: *${stats.disputes}*

━━━━━━━━━━━━━━━━━━

⭐ *Reputation*

Rating: *${reputation.rating}/5.0*
Reviews: *${reputation.reviews}*

━━━━━━━━━━━━━━━━━━

🛡 *Account*

Role: *${user.role}*
Status: *${user.status}*

📅 Joined: *${new Date(user.createdAt).toLocaleDateString()}*
`;
}
