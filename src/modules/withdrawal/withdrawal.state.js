const withdrawalStates = new Map();

export function getWithdrawalState(userId) {
  return withdrawalStates.get(userId);
}

export function setWithdrawalState(userId, state) {
  withdrawalStates.set(userId, state);
}

export function clearWithdrawalState(userId) {
  withdrawalStates.delete(userId);
}
