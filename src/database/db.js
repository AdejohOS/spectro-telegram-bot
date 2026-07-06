import pkg from "pg";
import { env } from "../config/env.js";

const { Pool } = pkg;

export const db = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});
