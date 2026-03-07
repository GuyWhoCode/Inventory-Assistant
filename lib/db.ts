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

export async function initDB() {
    // await db.query(`
    //     DROP TABLE IF EXISTS items;
    //     `);


    await db.query(`
    CREATE TABLE IF NOT EXISTS ITEMS (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity INTEGER,
        expiration DATE,
        usage_rate VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW()
    )
      `);
}
