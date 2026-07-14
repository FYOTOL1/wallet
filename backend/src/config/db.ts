import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const url = process.env.DB_URL || "";

const sql = neon(url);

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )`;
    console.log("Database Initialized Successfully!");
  } catch (error) {
    console.log("Error Initializing DB", error);
    process.exit(1); // 1 means failed and 0 means success
  }
}

export { sql, initDB };
