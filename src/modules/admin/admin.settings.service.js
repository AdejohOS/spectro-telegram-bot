import { AdminSettingsRepository } from "./admin.settings.repository.js";

export class AdminSettingsService {
  static async getSupportSettings() {
    return AdminSettingsRepository.getSupportSettings();
  }

  static async updateSupportUsername(username) {
    const normalized = username.trim().replace(/^@/, "");

    if (!/^[a-zA-Z0-9_]{5,32}$/.test(normalized)) {
      throw new Error("Enter a valid Telegram username, without spaces.");
    }

    const supportUsername = `@${normalized}`;
    const supportLink = `https://t.me/${normalized}`;

    await AdminSettingsRepository.set("support_username", supportUsername);

    await AdminSettingsRepository.set("support_link", supportLink);

    return {
      username: supportUsername,
      link: supportLink,
    };
  }
}
