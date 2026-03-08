import Link from "next/link";
import { db } from "@/lib/db";
import ItemCard from "./ItemCard";
import { ChartLineDots } from "./Chart";
import { UsageLog } from "@/types";

type Props = {
    params: Promise<{ id: string }>;
};

const today = new Date();

function diffInDays(a: Date, b: Date): number {
    const floorToMidnight = (d: Date) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(
        (floorToMidnight(a).getTime() - floorToMidnight(b).getTime()) /
            msPerDay,
    );
}

async function ItemsPage({ params }: Props) {
    const { id } = await params;
    const { rows } = await db.query("SELECT * FROM ITEMS WHERE id = $1", [id]);
    const { rows: logs } = await db.query("SELECT * FROM USAGE_LOGS WHERE item_id = $1", [id]);
    // rows is the query parameter stored in variable called logs


    const item = rows[0];

    if (!item) {
        return (
            <div>
                <p>Item with ID {id} was not found.</p>
                <Link href="/">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="p-8">
            <ItemCard item={item} />
            <br />
            <ChartLineDots
                data={
                    logs.map((log: UsageLog) => ({
                        day: diffInDays(today, log.logged_at),
                        usage_rate: log.usage_amount,
                    }))
                }
            />
        </div>
    );
}

export default ItemsPage;
