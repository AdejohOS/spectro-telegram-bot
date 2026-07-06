import { db } from "./database/db.js";

async function testConnection() {
  try {
    const result = await db.query("SELECT NOW()");

    console.log("✅ Database Connected");

    console.log(result.rows[0]);

    process.exit(0);
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

testConnection();
