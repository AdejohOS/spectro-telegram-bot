import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  BOT_TOKEN: z.string().min(1),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = envSchema.parse(process.env);
