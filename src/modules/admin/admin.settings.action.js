import { UserRepository } from "../users/user.repository.js";
import { AdminSettingsService } from "./admin.settings.service.js";
import { adminSupportSettingsKeyboard } from "./admin.settings.keyboard.js";

const supportInputState = new Map();

async function isAuthorizedAdmin(telegramId) {
  const admins = await UserRepository.findAdmins();

  return admins.some(
    (admin) => String(admin.telegramId) === String(telegramId),
  );
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

async function showSupportSettings(ctx) {
  const settings = await AdminSettingsService.getSupportSettings();
  const username = settings.username ?? "Not configured";

  const message = `<b>⚙️ Support Settings</b>

<b>Support Username:</b>
${escapeHtml(username)}

The Contact Support link is generated automatically from this username.

Select what you want to change.`;

  return ctx.reply(message, {
    parse_mode: "HTML",
    ...adminSupportSettingsKeyboard(),
  });
}

export function registerAdminSettingsActions(bot) {
  bot.action("ADMIN_SUPPORT_SETTINGS", async (ctx) => {
    await ctx.answerCbQuery();

    if (!(await isAuthorizedAdmin(ctx.from.id))) {
      return ctx.reply("❌ You are not authorized to access this setting.");
    }

    return showSupportSettings(ctx);
  });

  bot.action("ADMIN_EDIT_SUPPORT_USERNAME", async (ctx) => {
    await ctx.answerCbQuery();

    if (!(await isAuthorizedAdmin(ctx.from.id))) {
      return ctx.reply("❌ You are not authorized to change support settings.");
    }

    supportInputState.set(ctx.from.id, "username");

    return ctx.reply(
      "Send the new support Telegram username.\n\nExample: Banky or @Banky",
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  });

  bot.action("ADMIN_SUPPORT_BACK", async (ctx) => {
    await ctx.answerCbQuery();

    if (!(await isAuthorizedAdmin(ctx.from.id))) {
      return ctx.reply("❌ You are not authorized to access this setting.");
    }

    return showSupportSettings(ctx);
  });

  bot.action("ADMIN_SUPPORT_CANCEL", async (ctx) => {
    await ctx.answerCbQuery();
    supportInputState.delete(ctx.from.id);

    return ctx.reply("Support settings update cancelled.");
  });

  bot.on("text", async (ctx, next) => {
    if (ctx.chat.type !== "private") {
      return next();
    }

    const setting = supportInputState.get(ctx.from.id);

    if (!setting) {
      return next();
    }

    if (!(await isAuthorizedAdmin(ctx.from.id))) {
      supportInputState.delete(ctx.from.id);

      return ctx.reply("❌ You are not authorized to change support settings.");
    }

    const value = ctx.message.text.trim();

    try {
      await AdminSettingsService.updateSupportUsername(value);

      supportInputState.delete(ctx.from.id);

      await ctx.reply("✅ Support username and link updated successfully.");

      return showSupportSettings(ctx);
    } catch (error) {
      return ctx.reply(`❌ ${escapeHtml(error.message)}\n\nPlease try again.`, {
        parse_mode: "HTML",
      });
    }
  });
}
