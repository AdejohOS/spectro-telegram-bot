import { Markup } from "telegraf";

export function adminSupportSettingsKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "✏️ Edit Support Username",
        "ADMIN_EDIT_SUPPORT_USERNAME",
      ),
    ],

    [Markup.button.callback("⬅ Back to Admin", "ADMIN_PANEL")],
  ]);
}
