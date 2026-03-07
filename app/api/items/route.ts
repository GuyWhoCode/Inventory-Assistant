import { NextRequest, NextResponse } from "next/server";
import { db as dbConnection } from "@/lib/db";


// POST /api/items — add a new item
export async function POST(req: NextRequest) {
    try {
        const { name, quantity, expiration, usageRate } = await req.json();
        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { error: "Field 'name' is required and must be a string" },
                { status: 400 },
            );
        }

        const result = await dbConnection.query(
            `INSERT INTO ITEMS (name, quantity, expiration, usage_rate) VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, quantity, expiration, usageRate],
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
