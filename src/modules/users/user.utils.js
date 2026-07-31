import { clearDepositState } from "../deposit/deposit.state.js";
import { clearEscrowState } from "../escrow/escrow.state.js";
import { clearDisputeState } from "../escrow/dispute.state.js";
import { clearProductState } from "../shop/product.state.js";
import { clearWithdrawalState } from "../withdrawal/withdrawal.state.js";
import { clearAdminState } from "../admin/admin.state.js";

export function clearAllStates(userId) {
  clearDepositState(userId);
  clearEscrowState(userId);
  clearDisputeState(userId);
  clearProductState(userId);
  clearWithdrawalState(userId);
  clearAdminState(userId);
}
