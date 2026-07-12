import { formatMoney } from "../../utils/money.js";

export function shopListContent(products, page, totalPages) {
  let text = `<b>🛒 Spectro Shop</b>

`;

  if (!products.length) {
    return text + "No products available.";
  }

  text += `Page ${page} of ${totalPages}

`;

  products.forEach((product, index) => {
    text += `${index + 1}.

<b>${product.title}</b>

💰 ${formatMoney(product.price)}

📦 Stock: ${product.stock}

`;
  });

  return text;
}

export function shopProductContent(product) {
  return `<b>${product.title}</b>

💰 Price

${formatMoney(product.price)}

📦 Available

${product.stock}

━━━━━━━━━━━━━━

${product.description}`;
}
