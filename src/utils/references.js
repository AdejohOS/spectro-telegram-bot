export function generateReference(prefix) {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const hour = String(now.getHours()).padStart(2, "0");

  const minute = String(now.getMinutes()).padStart(2, "0");

  const second = String(now.getSeconds()).padStart(2, "0");

  const random = Math.floor(Math.random() * 9000 + 1000);

  return `${prefix}-${year}${month}${day}-${hour}${minute}${second}-${random}`;
}

export const REFERENCES = {
  DEPOSIT: "DEP",

  ADMIN_CREDIT: "ADM",

  ESCROW_LOCK: "ESL",
  ESCROW_RELEASE: "ESR",
  ESCROW_REFUND: "ESF",

  WITHDRAWAL: "WDR",
  ORDER: "ORD",

  REFUND: "REF",

  BONUS: "BON",
};

export function escrowStatusLabel(status) {
  switch (status) {
    case ESCROW_STATUS.PENDING_SELLER:
      return "🟡 Pending Seller";

    case ESCROW_STATUS.WAITING_FUNDING:
      return "💰 Waiting Funding";

    case ESCROW_STATUS.FUNDED:
      return "🔒 Funded";

    case ESCROW_STATUS.DELIVERED:
      return "📦 Delivered";

    case ESCROW_STATUS.COMPLETED:
      return "✅ Completed";

    case ESCROW_STATUS.DISPUTED:
      return "⚖️ Disputed";

    case ESCROW_STATUS.REJECTED:
      return "❌ Rejected";

    case ESCROW_STATUS.REFUNDED:
      return "↩ Refunded";

    case ESCROW_STATUS.CANCELLED:
      return "Cancelled";

    default:
      return status;
  }
}

export const ESCROW_STATUS = {
  PENDING_SELLER: "awaiting_seller",

  DELIVERED: "delivered",
  ACCEPTED: "accepted",
  COMPLETED: "completed",
  REJECTED: "rejected",
  DISPUTED: "disputed",
  CANCELLED: "cancelled",
};

export const ESCROW_EVENTS = {
  CREATED: "Escrow Created",

  ACCEPTED: "Seller Accepted",

  REJECTED: "Seller Rejected",

  FUNDED: "Buyer Funded",

  DELIVERED: "Seller Marked Delivered",

  RELEASED: "Buyer Released Payment",

  DISPUTED: "Dispute Opened",

  REFUNDED: "Buyer Refunded",

  CANCELLED: "Escrow Cancelled",
};

export const WALLET_TRANSACTION_TYPES = {
  ADMIN_CREDIT: "admin_credit",

  DEPOSIT: "deposit",

  ESCROW_LOCK: "escrow_lock",

  ESCROW_RELEASE: "escrow_release",
  ESCROW_PAYMENT: "escrow_payment",

  ESCROW_REFUND: "escrow_refund",

  WITHDRAWAL: "withdrawal",
};

export const WALLET_ORDER_TYPES = {
  ORDER_LOCK: "order_lock",
  ORDER_RELEASE: "order_release",
  ORDER_REFUND: "order_refund",
};
