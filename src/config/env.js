import dotenv from "dotenv";

dotenv.config();

export const env = {
  botToken: process.env.BOT_TOKEN,

  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  nodeEnv: process.env.NODE_ENV ?? "development",
};
