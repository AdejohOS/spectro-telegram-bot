import { formatMoney } from "../../utils/money.js";

function maskAddress(address) {
  if (!address || address.length < 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export function withdrawalConfirmationContent(state) {
  return `
<b>💸 Confirm Withdrawal</b>

━━━━━━━━━━━━━━

<b>Amount</b>

💰 ${formatMoney(state.amount)} USDT

<b>Network</b>

${state.network}

<b>Wallet Address</b>

<code>${maskAddress(state.address)}</code>

━━━━━━━━━━━━━━

Please confirm this withdrawal.
`;
}

export function withdrawalMenuContent(wallet) {
  return `
<b>💸 Withdrawal</b>

━━━━━━━━━━━━━━

<b>Available Balance</b>

💰 ${formatMoney(wallet.availableBalance)} USDT

━━━━━━━━━━━━━━

Choose an option below.
`;
}
