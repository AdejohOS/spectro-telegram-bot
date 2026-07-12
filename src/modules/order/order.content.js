import { formatMoney } from "../../utils/money.js";

export function orderDetailsContent(order) {
  return `<b>🛒 Order Details</b>

━━━━━━━━━━━━━━

<b>Reference</b>

<code>${order.orderNumber}</code>

<b>Buyer</b>

@${order.buyerUsername || "N/A"}

${order.buyerFirstName}

<b>Product</b>

${order.productTitle}

<b>Amount</b>

💰 ${formatMoney(order.amount)}

<b>Status</b>

${order.status.toUpperCase()}

━━━━━━━━━━━━━━`;
}

export function orderListContent(status, orders, page, totalPages) {
  let text = `<b>🛒 ${status.toUpperCase()} Orders</b>\n\n`;

  if (!orders.length) {
    return text + "No orders found.";
  }

  text += `Page ${page} of ${totalPages}\n\n`;

  orders.forEach((order, index) => {
    text += `${index + 1}.

<code>${order.orderNumber}</code>

💰 ${formatMoney(order.amount)}

📦 ${order.productTitle}

\n`;
  });

  return text;
}
