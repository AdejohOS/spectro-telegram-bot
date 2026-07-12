export function formatMoney(amount) {
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function toMinorUnits(amount) {
  return Math.round(Number(amount) * 100);
}

export function fromMinorUnits(amount) {
  return Number(amount) / 100;
}
