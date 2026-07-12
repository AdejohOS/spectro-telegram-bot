import { formatMoney } from "../../utils/money.js";
import { PRODUCT_STATUS } from "./product.status.js";

export function productConfirmationContent(state) {
  return `<b>📦 Confirm Product</b>

<b>Title</b>

${state.title}

<b>Description</b>

${state.description}

<b>Price</b>

💰 ${formatMoney(state.price)}

<b>Stock</b>

${state.stock}

Create this product?`;
}

export function productListContent(products, page, totalPages) {
  let text = `<b>📦 Products</b>\n\n`;

  if (!products.length) {
    return text + "No products available.";
  }

  text += `Page ${page} of ${totalPages}\n\n`;

  products.forEach((product, index) => {
    text += `${index + 1}.

<b>${product.title}</b>

💰 ${formatMoney(product.price)}

📦 Stock: ${product.stock}

\n`;
  });

  return text;
}

export function productDetailsContent(product) {
  return `<b>📦 ${product.title}</b>

━━━━━━━━━━━━━━
💰 Price

${formatMoney(product.price)}

📦 Stock

${product.stock}


${product.status === PRODUCT_STATUS.ACTIVE ? "🟢 Active" : "🔴 Inactive"}


📄 Description

${product.description}

━━━━━━━━━━━━━━`;
}
