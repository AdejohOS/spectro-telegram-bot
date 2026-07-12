const adminStates = new Map();

export function setAdminState(adminId, state) {
  adminStates.set(adminId, state);
}

export function getAdminState(adminId) {
  const state = adminStates.get(adminId);

  return state;
}

export function clearAdminState(adminId) {
  adminStates.delete(adminId);
}
