import { NextRequest, NextResponse } from "next/server";
import { db as dbConnection } from "@/lib/db";
import { generateFixedSumInRange } from "@/lib/generateFixedSumInRange";
import { UsageLog } from "@/types";
import randomInt from "@/lib/randomInt";

async function seedUsageLogs(rows: UsageLog[] = []) {
    const client = await dbConnection.connect();

    try {
        await client.query("BEGIN");

        await client.query(
            `INSERT INTO USAGE_LOGS (item_id, usage_amount, logged_at)
       SELECT * FROM jsonb_to_recordset($1::jsonb)
       AS x(item_id INTEGER, usage_amount INTEGER, logged_at TIMESTAMPTZ)`,
            [JSON.stringify(rows)],
        );

        await client.query("COMMIT");
        console.log(`Seeded ${rows.length} items.`);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Seed failed, transaction rolled back:", err);
        throw err;
    } finally {
        client.release();
    }
}

function daysAgo(n: number): Date {
    const today = new Date();
    const d = new Date(today);
    d.setDate(today.getDate() - n);
    return d;
}

// POST /api/items — add a new item
export async function POST(req: NextRequest) {
    const USAGE_RATE_MAXIMUM = 20; // Max average usage rate for seeding

    try {
        const { name, quantity, expiration } = await req.json();
        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { error: "Field 'name' is required and must be a string" },
                { status: 400 },
            );
        }

        const averageUsageRate = randomInt(1, USAGE_RATE_MAXIMUM);
        // Initially set as random to generate test usage logs

        const result = await dbConnection.query(
            `INSERT INTO ITEMS (name, quantity, expiration, usage_rate) VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, quantity, expiration, averageUsageRate],
        );

        seedUsageLogs(
            generateFixedSumInRange(averageUsageRate).map(
                (usage_rate, index) => ({
                    item_id: result.rows[0].id,
                    usage_amount: usage_rate,
                    logged_at: daysAgo(index + 1),
                }),
            ),
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
        return NextResponse.json({ items: result.rows }, { status: 200 });
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
