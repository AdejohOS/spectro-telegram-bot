const escrowStates = new Map();

export function setEscrowState(userId, state) {
  escrowStates.set(userId, state);
}

export function getEscrowState(userId) {
  return escrowStates.get(userId);
}

export function clearEscrowState(userId) {
  escrowStates.delete(userId);
}
