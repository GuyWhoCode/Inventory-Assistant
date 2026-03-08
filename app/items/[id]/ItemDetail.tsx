"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import ItemCard from "./ItemCard";
import { ChartLineDots } from "./Chart";
import { Item, UsageLog } from "@/types";

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

export default function ItemDetail({ id }: { id: string }) {
    const queryClient = useQueryClient();

    const { data: item, isPending: itemPending } = useQuery<Item>({
        queryKey: ["items", id],
        queryFn: () =>
            fetch(`/api/items/${id}`)
                .then((r) => r.json())
                .then((r) => r.item),
    });

    const { data: logs, isPending: logsPending } = useQuery<UsageLog[]>({
        queryKey: ["usage-logs", id],
        queryFn: () =>
            fetch(`/api/usage-log?item_id=${id}`)
                .then((r) => r.json())
                .then((r) => r.logs),
    });

    const handleUsageLogSubmit = async (usage_amount: number) => {
        const response = await fetch("/api/usage-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item_id: parseInt(id), usage_amount }),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        await queryClient.invalidateQueries({ queryKey: ["items", id] });
        await queryClient.invalidateQueries({ queryKey: ["usage-logs", id] });
    };

    if (itemPending || logsPending) return <p>Loading...</p>;

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
            <ItemCard item={item} onUsageLogSubmit={handleUsageLogSubmit} />
            <br />
            <ChartLineDots
                data={(logs ?? []).map((log) => ({
                    day: diffInDays(today, new Date(log.logged_at)),
                    usage_rate: log.usage_amount,
                }))}
            />
        </div>
    );
}
