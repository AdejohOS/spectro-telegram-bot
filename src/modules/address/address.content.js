export function addressPoolContent() {
  return `🏦 <b>Address Pool</b>

Manage your cryptocurrency deposit addresses.

Select a network below.`;
}
export function networkContent(network) {
  return `🏦 <b>${network} Address Pool</b>

Manage your ${network} deposit addresses.

Choose an option below.`;
}
export function addressListContent(network, addresses, page, totalPages) {
  let text = `🏦 <b>${network} Addresses</b>

`;

  addresses.forEach((address, index) => {
    text += `${index + 1}.

<code>${address.address}</code>

${address.assignedUserId ? "🔒 Assigned" : "🟢 Available"}

━━━━━━━━━━━━━━

`;
  });

  text += `Page ${page}/${totalPages}`;

  return text;
}
export function addressStatisticsContent(network, stats) {
  return `📊 <b>${network} Statistics</b>

━━━━━━━━━━━━━━

Total

${stats.total}

Available

${stats.available}

Assigned

${stats.assigned}

Inactive

${stats.inactive}`;
}
