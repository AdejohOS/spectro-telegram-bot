export function depositAddressMessage(network, address) {
  return `
💰 *${network} Deposit*

Your personal *${network}* deposit address: 

\`${address}\`

━━━━━━━━━━━━━━━━━━

⚠️ Only send *${network}* to this address.

Deposits sent on the wrong network may be permanently lost.

━━━━━━━━━━━━━━━━━━

Once your transaction has been confirmed, tap:

✅ *I Have Deposited*
`;
}
