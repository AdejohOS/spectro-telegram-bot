export function depositMessage(network, amount, address) {
  return `
💰 *${network} Deposit*

Amount

*$${amount}*

━━━━━━━━━━━━━━

Deposit Address

\`${address}\`

⚠️ Send *ONLY ${network}* to this address.

Once payment is completed, tap *I Have Deposited*.`;
}
