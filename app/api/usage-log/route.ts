import { NextRequest, NextResponse } from "next/server";
import { db as dbConnection } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { item_id, usage_amount } = await req.json();

        if (!item_id || typeof item_id !== "number") {
            return NextResponse.json(
                { error: "Field 'item_id' is required and must be a number" },
                { status: 400 },
            );
        }
        if (!usage_amount || typeof usage_amount !== "number") {
            return NextResponse.json(
                {
                    error: "Field 'usage_amount' is required and must be a number",
                },
                { status: 400 },
            );
        }

        const client = await dbConnection.connect();

        try {
            await client.query("BEGIN");

            const checkExistingUsageLog = await client.query(
                `SELECT * FROM USAGE_LOGS WHERE logged_at::date = CURRENT_DATE AND item_id = $1`,
                [item_id],
            );

            const isUpdate = checkExistingUsageLog.rows.length > 0;

            if (isUpdate) {
                await client.query(
                    `UPDATE USAGE_LOGS SET usage_amount = $1 WHERE logged_at::date = CURRENT_DATE AND item_id = $2`,
                    [usage_amount, item_id],
                );
            } else {
                await client.query(
                    `INSERT INTO USAGE_LOGS (item_id, usage_amount) VALUES ($1, $2)`,
                    [item_id, usage_amount],
                );
            }

            const {
                rows: [{ avg }],
            } = await client.query(
                `SELECT AVG(usage_amount) FROM USAGE_LOGS WHERE item_id = $1`,
                [item_id],
            );

            const newUsageRate = Math.round(parseFloat(avg));

            await client.query(
                `UPDATE ITEMS SET usage_rate = $1 WHERE id = $2`,
                [newUsageRate, item_id],
            );

            await client.query("COMMIT");

            return NextResponse.json(
                {
                    message: isUpdate
                        ? "Usage log updated for today"
                        : "Usage log created",
                },
                { status: isUpdate ? 200 : 201 },
            );
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

export async function GET(req: NextRequest) {
    try {
        const item_id = req.nextUrl.searchParams.get("item_id");

        if (!item_id || isNaN(parseInt(item_id))) {
            return NextResponse.json(
                {
                    error: "Query param 'item_id' is required and must be a number",
                },
                { status: 400 },
            );
        }

        const { rows } = await dbConnection.query(
            `SELECT * FROM USAGE_LOGS WHERE item_id = $1 ORDER BY logged_at ASC`,
            [parseInt(item_id)],
        );

        return NextResponse.json({ logs: rows }, { status: 200 });
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
