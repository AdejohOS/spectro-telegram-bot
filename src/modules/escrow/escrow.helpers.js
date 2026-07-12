import { getEscrowState } from "./escrow.state.js";
import { escrowConfirmation } from "./escrow.content.js";
import { confirmEscrowKeyboard } from "./escrow.keyboard.js";
import { ESCROW_STATUS } from "../../constants/escrow-status.js";

export async function sendEscrowConfirmation(ctx) {
  const state = getEscrowState(ctx.from.id);

  return ctx.reply(escrowConfirmation(state), {
    parse_mode: "Markdown",
    reply_markup: confirmEscrowKeyboard().reply_markup,
  });
}

export function resolveEscrowStatuses(type) {
  switch (type) {
    case "pending":
      return [ESCROW_STATUS.PENDING_SELLER];

    case "funding":
      return [ESCROW_STATUS.WAITING_FUNDING];

    case "active":
      return [ESCROW_STATUS.FUNDED, ESCROW_STATUS.DELIVERED];

    case "completed":
      return [ESCROW_STATUS.COMPLETED];

    case "rejected":
      return [ESCROW_STATUS.REJECTED];

    case "disputed":
      return [ESCROW_STATUS.DISPUTED];

    default:
      return [];
  }
}
