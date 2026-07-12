import { ADMINS } from "../config/admins.js";

export function isAdmin(telegramId) {
  return ADMINS.includes(Number(telegramId));
}
