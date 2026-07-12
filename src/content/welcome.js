function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function welcomeMessage(firstName) {
  return `👋 Welcome, ${escapeHtml(firstName)}!

Welcome to <b>Spectro Escrow</b>.

Your trusted platform for secure digital transactions.

Every transaction is protected by our escrow system, giving both buyers and sellers a safe trading experience.

Choose an option below to get started.`;
}
