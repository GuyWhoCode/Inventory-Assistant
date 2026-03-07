import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "itemsdb",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
});

console.log("Database connection pool created with config:", {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "itemsdb",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
});

// Ensure the ITEMS table exists
async function initDB() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS ITEMS (
      id        SERIAL PRIMARY KEY,
      name      VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

// POST /api/items — add a new item
export async function POST(req: NextRequest) {
    try {
        await initDB();

        const body = await req.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Field 'name' is required" },
                { status: 400 },
            );
        }

        const result = await pool.query(
            `INSERT INTO ITEMS (name, description) VALUES ($1, $2) RETURNING *`,
            [name, description ?? null],
        );
        return NextResponse.json({ item: result.rows[0] }, { status: 201 });
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// GET /api/items — list all items
export async function GET() {
    try {
        await initDB();
        const result = await pool.query(
            `SELECT * FROM ITEMS ORDER BY created_at DESC`,
        );
        console.log(result.rows)
        return NextResponse.json({ items: result.rows }, { status: 200 });
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
