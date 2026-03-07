import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const dbConnection = new Pool({
    host: "localhost",
    port: 5433,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Ensure the ITEMS table exists
async function initDB() {
    // await dbConnection.query(`
    //     DROP TABLE IF EXISTS ITEMS
    // `);


    await dbConnection.query(`
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

// POST /api/items — add a new item
export async function POST(req: NextRequest) {
    try {
        await initDB();

        const { name, quantity, expiration } = await req.json();
        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { error: "Field 'name' is required and must be a string" },
                { status: 400 },
            );
        }

        const result = await dbConnection.query(
            `INSERT INTO ITEMS (name, quantity, expiration) VALUES ($1, $2, $3) RETURNING *`,
            [name, quantity, expiration],
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
        const result = await dbConnection.query(
            `SELECT * FROM ITEMS ORDER BY created_at DESC`,
        );
        console.log(result.rows);
        return NextResponse.json({ items: result.rows }, { status: 200 });
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// DELETE /api/items — delete an item by ID
export async function DELETE(req: NextRequest) {
    try {
        await initDB();
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json(
                { error: "Field 'id' is required" },
                { status: 400 },
            );
        }
        await dbConnection.query(`DELETE FROM ITEMS WHERE id = $1`, [id]);
        return NextResponse.json({ message: "Item deleted" }, { status: 200 });
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
