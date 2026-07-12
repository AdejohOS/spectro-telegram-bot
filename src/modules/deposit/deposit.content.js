export function depositMessage(network, address) {
  return `
💰 *${network} Deposit*

Your unique deposit address:

\`${address}\`

⚠️ Send *ONLY ${network}* to this address.

Funds will be credited by an administrator after the transaction has been verified.

If you have already made a deposit, tap *I Have Deposited* below.
`;
}
