const disputeState = new Map();

export function getDisputeState(userId) {
  return disputeState.get(userId);
}

export function setDisputeState(userId, state) {
  disputeState.set(userId, state);
}

export function clearDisputeState(userId) {
  disputeState.delete(userId);
}
