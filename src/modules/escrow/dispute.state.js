const disputeStates = new Map();

export function getDisputeState(userId) {
  return disputeStates.get(userId);
}

export function setDisputeState(userId, state) {
  disputeStates.set(userId, state);
}

export function clearDisputeState(userId) {
  disputeStates.delete(userId);
}
