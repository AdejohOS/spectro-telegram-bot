const depositStates = new Map();

export function setDepositState(userId, state) {
  depositStates.set(userId, state);
}

export function getDepositState(userId) {
  return depositStates.get(userId);
}

export function clearDepositState(userId) {
  depositStates.delete(userId);
}
