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

        const checkExistingUsageLog = await dbConnection.query(
            `SELECT * FROM USAGE_LOGS WHERE logged_at::date = CURRENT_DATE AND item_id = $1`,
            [item_id],
        );

        if (checkExistingUsageLog.rows.length > 0) {
            await dbConnection.query(
                `UPDATE USAGE_LOGS SET usage_amount = $1 WHERE logged_at::date = CURRENT_DATE AND item_id = $2`,
                [usage_amount, item_id],
            );

            return NextResponse.json(
                { message: "Usage log updated for today" },
                { status: 200 },
            );
        }

        const result = await dbConnection.query(
            `INSERT INTO USAGE_LOGS (item_id, usage_amount) VALUES ($1, $2) RETURNING *`,
            [item_id, usage_amount],
        );
        return NextResponse.json(
            { usage_log: result.rows[0] },
            { status: 201 },
        );
    } catch (err) {
        console.error("DB error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
