export function generateEscrowNumber() {
  const year = new Date().getFullYear();

  const random = Math.floor(100000 + Math.random() * 900000);

  return `ESC-${year}-${random}`;
}
