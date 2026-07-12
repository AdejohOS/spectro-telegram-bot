const states = new Map();

export function getProductState(userId) {
  return states.get(userId);
}

export function setProductState(userId, state) {
  states.set(userId, state);
}

export function clearProductState(userId) {
  states.delete(userId);
}
