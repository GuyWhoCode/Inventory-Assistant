import { NextRequest, NextResponse } from "next/server";
import { db as dbConnection } from "@/lib/db";
import { generateFixedSumInRange } from "@/lib/generateFixedSumInRange";
import { ItemEntry, UsageLog } from "@/types";
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

// POST /api/items — add new items
export async function POST(req: NextRequest) {
    const USAGE_RATE_MAXIMUM = 20;
    try {
        const { items }: { items: ItemEntry[] } = await req.json();

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                {
                    error: "Field 'items' is required and must be a non-empty array",
                },
                { status: 400 },
            );
        }

        for (const item of items) {
            if (!item.name || typeof item.name !== "string") {
                return NextResponse.json(
                    { error: `Field 'name' is required and must be a string` },
                    { status: 400 },
                );
            }
        }

        const client = await dbConnection.connect();

        try {
            await client.query("BEGIN");

            const usageRates = items.map(() =>
                randomInt(1, USAGE_RATE_MAXIMUM),
            );

            const values = items.flatMap(
                ({ name, quantity, expiration }, i) => [
                    name,
                    quantity,
                    expiration,
                    usageRates[i],
                ],
            );

            const placeholders = items
                .map(
                    (_, i) =>
                        `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`,
                )
                .join(", ");

            const result = await client.query(
                `INSERT INTO ITEMS (name, quantity, expiration, usage_rate) VALUES ${placeholders} RETURNING *`,
                values,
            );

            await client.query("COMMIT");

            result.rows.forEach((inserted, i) => {
                seedUsageLogs(
                    generateFixedSumInRange(usageRates[i]).map(
                        (usage_rate, index) => ({
                            item_id: inserted.id,
                            usage_amount: usage_rate,
                            logged_at: daysAgo(index + 1),
                        }),
                    ),
                );
            });

            return NextResponse.json({ items: result.rows }, { status: 201 });
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
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
