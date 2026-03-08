import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
    pool: Pool | undefined;
};

export const db =
    globalForPg.pool ??
    new Pool({
        host: "localhost",
        port: 5433,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPg.pool = db;
}

let initialized = false;
export async function initDB() {
    if (initialized) return;
    initialized = true;

    await db.query(`
        DROP TABLE IF EXISTS ITEMS CASCADE;
        `);
    await db.query(`
        DROP TABLE IF EXISTS USAGE_LOGS;
        `);

    await db.query(`
    CREATE TABLE IF NOT EXISTS ITEMS (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity INTEGER,
        expiration DATE,
        usage_rate NUMERIC DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )
      `);

    await db.query(`
    CREATE TABLE IF NOT EXISTS USAGE_LOGS (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES ITEMS(id) ON DELETE CASCADE,
        usage_amount INTEGER,
        logged_at TIMESTAMPTZ DEFAULT NOW()
    )
      `);
}
